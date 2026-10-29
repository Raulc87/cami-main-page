#!/usr/bin/env bash
# Uploads a built site to GoDaddy over FTPS (CMP-093, ADR-010). Run by .github/workflows/deploy-site.yml
# from the repo root, after the bundle check.
#
# Environment: FTP_HOST, FTP_USER, FTP_PASSWORD (environment secrets), SITE_DIR (the built site),
# DRY_RUN (true|false), RUNNER_TEMP; GITHUB_STEP_SUMMARY when run by Actions.
#
# Explicit FTPS only: --ssl-reqd makes curl refuse to continue without TLS and --proto =ftp refuses
# every other protocol; certificate checks stay on (no -k). The login goes through a netrc file
# (mode 600, removed on exit), never the command line, so it is in no process list or log. Nothing
# prints it: no `set -x`, no verbose curl. The FTP account is limited to public_html, so paths are
# relative to the login folder.
#
# What it changes: it adds and changes files and deletes only files the manifest on the server lists
# (the files an earlier run uploaded) that the new build no longer has. The manifest is written last.
set -euo pipefail

: "${FTP_HOST:?}" "${FTP_USER:?}" "${FTP_PASSWORD:?}" "${SITE_DIR:?}" "${RUNNER_TEMP:?}"
DRY_RUN="${DRY_RUN:-true}"
MANIFEST_NAME=".deploy-site-manifest"
WORK_DIR="$RUNNER_TEMP/site-upload"
NETRC_FILE="$WORK_DIR/netrc"

# A host name only (no scheme, port or path) and a login with no spaces.
[[ "$FTP_HOST" =~ ^[A-Za-z0-9.-]+$ ]] || { echo "::error::FTP_HOST must be a host name only."; exit 1; }
[[ "$FTP_USER" =~ ^[^[:space:]]+$ && "$FTP_PASSWORD" =~ ^[^[:space:]]+$ ]] || { echo "::error::FTP_USER and FTP_PASSWORD must not contain spaces."; exit 1; }
echo "::add-mask::$FTP_HOST"
echo "::add-mask::$FTP_USER"

cleanup() { rm -rf "$WORK_DIR"; }
trap cleanup EXIT
umask 077
mkdir -p "$WORK_DIR/plan"
printf 'machine %s login %s password %s\n' "$FTP_HOST" "$FTP_USER" "$FTP_PASSWORD" > "$NETRC_FILE"

ftp_curl() {
  curl --silent --show-error --fail --proto =ftp --ssl-reqd --tlsv1.2 --ftp-skip-pasv-ip \
    --connect-timeout 20 --max-time 180 --retry 2 --netrc-file "$NETRC_FILE" "$@"
}

echo "::group::Manifest on the server"
MANIFEST_FILE="$WORK_DIR/manifest.old"
set +e
ftp_curl "ftp://$FTP_HOST/$MANIFEST_NAME" -o "$MANIFEST_FILE" 2> "$WORK_DIR/curl.err"
status=$?
set -e
case "$status" in
  0) echo "Manifest read: $(wc -l < "$MANIFEST_FILE" | tr -d ' ') files recorded by earlier runs." ;;
  78) echo "No manifest on the server: first run, every file is an addition."; MANIFEST_FILE="-" ;;
  67|9) echo "::error::The FTP login was refused or the account cannot read its folder (curl $status). Check the FTP_* secrets."; exit 1 ;;
  *) echo "::error::Could not read the manifest (curl exit $status)."; exit 1 ;;
esac
echo "::endgroup::"

echo "::group::Upload plan"
node .github/scripts/site-plan.mjs "$SITE_DIR" "$MANIFEST_FILE" "$WORK_DIR/plan" | tee "$WORK_DIR/plan.txt"
echo "::endgroup::"
[ -z "${GITHUB_STEP_SUMMARY:-}" ] || { echo '### Site upload plan'; echo '```'; cat "$WORK_DIR/plan.txt"; echo '```'; } >> "$GITHUB_STEP_SUMMARY"

if [ "$DRY_RUN" = "true" ]; then
  echo "Dry run: nothing was uploaded or deleted."
  exit 0
fi

echo "::group::Upload"
count=0
while IFS= read -r path; do
  [ -n "$path" ] || continue
  ftp_curl --ftp-create-dirs -T "$SITE_DIR/$path" "ftp://$FTP_HOST/$path"
  count=$((count + 1))
done < "$WORK_DIR/plan/upload.txt"
echo "Uploaded $count files."
echo "::endgroup::"

echo "::group::Delete files an earlier run uploaded and this build no longer has"
count=0
while IFS= read -r path; do
  [ -n "$path" ] || continue
  # A file already gone is not an error: the aim is that it is not there.
  ftp_curl -o /dev/null -Q "-DELE $path" "ftp://$FTP_HOST/" || echo "Could not delete $path (continuing)."
  count=$((count + 1))
done < "$WORK_DIR/plan/delete.txt"
echo "Deleted $count files."
echo "::endgroup::"

# Last: the manifest says what this run uploaded, so a run that stopped half-way is simply repeated.
ftp_curl -T "$WORK_DIR/plan/manifest.new" "ftp://$FTP_HOST/$MANIFEST_NAME"
echo "Manifest updated. Upload finished."
