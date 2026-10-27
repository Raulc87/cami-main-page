#!/usr/bin/env bash
# Deploys apps-script/ with clasp (CMP-047). Run by .github/workflows/deploy-apps-script.yml from
# the repo root, the only place that holds the Google login.
#
# Environment (all set by the workflow): TARGET_ENV (staging|production), DRY_RUN (true|false),
# CLASP_CREDENTIALS, APPS_SCRIPT_ID, APPS_SCRIPT_DEPLOYMENT_ID, RUNNER_TEMP, GITHUB_RUN_NUMBER,
# GITHUB_SHA, GITHUB_STEP_SUMMARY.
#
# The login file is written here and removed on exit, whatever happens. Nothing prints a secret:
# no `set -x`, no cat of a credential file.
set -euo pipefail

CLASP="${CLASP_BIN:-$GITHUB_WORKSPACE/.github/clasp/node_modules/.bin/clasp}"
AUTH_FILE="$RUNNER_TEMP/.clasprc.json"

cleanup() { rm -f "$AUTH_FILE" .clasp.json; }
trap cleanup EXIT

umask 077
printf '%s' "$CLASP_CREDENTIALS" > "$AUTH_FILE"
node -e 'require("fs").writeFileSync(".clasp.json", JSON.stringify({ scriptId: process.env.APPS_SCRIPT_ID.trim(), rootDir: "apps-script" }))'
export clasp_config_auth="$AUTH_FILE"
DEPLOYMENT_ID="$(printf '%s' "$APPS_SCRIPT_DEPLOYMENT_ID" | tr -d '[:space:]')"

echo "::group::Target project"
GITHUB_OUTPUT_FILE="$RUNNER_TEMP/target-output.txt"
: > "$GITHUB_OUTPUT_FILE"
CLASP_AUTH_FILE="$AUTH_FILE" EXPECTED_ENV="$TARGET_ENV" GITHUB_OUTPUT="$GITHUB_OUTPUT_FILE" \
  node .github/scripts/apps-script-target.mjs
PREVIOUS_VERSION="$(sed -n 's/^previous_version=//p' "$GITHUB_OUTPUT_FILE" | head -n 1)"
echo "::endgroup::"

echo "::group::Files that will be pushed"
"$CLASP" status
echo "::endgroup::"

if [ "$DRY_RUN" = "true" ]; then
  echo "Dry run: nothing was pushed."
  exit 0
fi

echo "::group::Push and deploy"
# clasp sends nothing when no repo file differs from the project, so a file removed from the repo
# would stay in the project. When the project holds files the repo lacks, make one file differ (a
# trailing newline, on this runner's copy only) so that the push replaces the whole file set.
EXTRA_FILES="$(CLASP_AUTH_FILE="$AUTH_FILE" node .github/scripts/apps-script-leftovers.mjs count || echo 0)"
if [ "${EXTRA_FILES:-0}" -gt 0 ] 2>/dev/null; then
  echo "The project holds $EXTRA_FILES file(s) that the repo does not have: forcing a full push so that they are removed."
  printf '\n' >> apps-script/Code.js
  {
    echo "## Files removed from the project"
    echo "The project held $EXTRA_FILES file(s) that the \`apps-script/\` folder does not have; this deploy forced a full push to remove them."
  } >> "${GITHUB_STEP_SUMMARY:-/dev/null}"
fi
"$CLASP" push --force
CLASP_AUTH_FILE="$AUTH_FILE" node .github/scripts/apps-script-leftovers.mjs warn || true
"$CLASP" deploy --deploymentId "$DEPLOYMENT_ID" --description "${GITHUB_SHA::7} run ${GITHUB_RUN_NUMBER}"
echo "::endgroup::"

echo "::group::Smoke request"
if APPS_SCRIPT_DEPLOYMENT_ID="$DEPLOYMENT_ID" node .github/scripts/apps-script-smoke.mjs; then
  echo "::endgroup::"
  exit 0
fi
echo "::endgroup::"

# The new version is live as soon as it is deployed: serve the version that was live before.
# Time triggers run the saved code (Head), which stays as pushed: the change must be reverted in
# the repository and deployed again.
if [ -n "$PREVIOUS_VERSION" ]; then
  echo "::group::Putting version $PREVIOUS_VERSION back"
  "$CLASP" deploy --deploymentId "$DEPLOYMENT_ID" --versionNumber "$PREVIOUS_VERSION" --description "rollback after run ${GITHUB_RUN_NUMBER}" || true
  {
    echo "## Rolled back"
    echo "The smoke request failed, so the deployment serves version $PREVIOUS_VERSION again. **This does NOT roll back Head: the time triggers keep running the faulty code (they run the saved code).** Revert the pull request and deploy the reverted code. If the faulty code could harm data (wrong rows, emails to participants), delete both triggers meanwhile and add them again afterwards (runbook sections 2.6 and 2.7)."
  } >> "$GITHUB_STEP_SUMMARY"
  APPS_SCRIPT_DEPLOYMENT_ID="$DEPLOYMENT_ID" node .github/scripts/apps-script-smoke.mjs || true
  echo "::endgroup::"
else
  echo "::warning::The previous version is not known: roll back by hand (runbook section 6)."
fi
exit 1
