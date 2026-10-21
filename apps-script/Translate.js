// Spanish -> English for event name and description (FFR-028). The automatic translation is
// kept in the `Translations` tab (hash of the Spanish text, English text), so it is recomputed
// only when that text changes. Cami's `nameEn`/`descriptionEn` override it. The tab, not script
// properties, holds them: the Apps Script settings page turns read-only past 50 properties.

var TRANSLATIONS_SHEET = 'Translations';
var TRANSLATIONS_HEADERS = ['hash', 'text'];
var TRANSLATION_PREFIX = 'TR_'; // properties of the earlier version, removed by deleteTranslationProperties()

function textHash_(text) {
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, text, Utilities.Charset.UTF_8);
  return bytes.map(function (b) { return ((b < 0 ? b + 256 : b) + 256).toString(16).slice(1); }).join('');
}

// The stored translations as { hash: text }. A missing tab or a read problem gives {}.
function loadTranslations_() {
  var map = {};
  try {
    readTable(TRANSLATIONS_SHEET).forEach(function (r) {
      var hash = String(r.v.hash);
      if (hash && !(hash in map)) map[hash] = String(r.v.text);
    });
  } catch (err) {
    console.error('translations read failed: ' + err.name);
  }
  return map;
}

// English text for `spanish`: the override if given, else the stored translation, else a new
// one (stored in `cache` and in the tab). If the translation service fails the Spanish text is
// returned and nothing is stored.
function englishText_(spanish, override, cache) {
  if (override) return override;
  var key = textHash_(spanish);
  if (cache[key]) return cache[key];
  try {
    var translated = LanguageApp.translate(spanish, 'es', 'en');
    if (translated) {
      cache[key] = translated;
      try {
        getOrCreateSheet(TRANSLATIONS_SHEET, TRANSLATIONS_HEADERS).appendRow([key, neutralize(translated)]);
      } catch (err) {
        console.error('translation not stored: ' + err.name); // still used for this answer
      }
      return translated;
    }
  } catch (err) {
    console.error('translate failed: ' + err.name);
  }
  return spanish;
}

// Housekeeping (5-minute trigger): drops the stored translations that no valid event uses any
// more, and repeated rows of one text. The tab stays as small as the event list.
function pruneTranslations_() {
  var sheet = getSpreadsheet().getSheetByName(TRANSLATIONS_SHEET);
  if (!sheet || sheet.getLastRow() < 2) return;
  var needed = {};
  readEvents().valid.forEach(function (ev) {
    needed[textHash_(ev.name)] = true;
    needed[textHash_(ev.description)] = true;
  });
  var rows = readTable(TRANSLATIONS_SHEET);
  var seen = {};
  var drop = [];
  rows.forEach(function (r) {
    var hash = String(r.v.hash);
    if (!needed[hash] || seen[hash]) drop.push(r.row);
    seen[hash] = true;
  });
  drop.sort(function (a, b) { return b - a; }).forEach(function (row) { sheet.deleteRow(row); });
}

// Editor-run maintenance. Deletes the `TR_<hash>` script properties that earlier versions kept
// (they filled the 50 properties the settings page can edit). Logs counts only.
function deleteTranslationProperties() {
  var props = PropertiesService.getScriptProperties();
  var names = Object.keys(props.getProperties()).filter(function (k) { return k.indexOf(TRANSLATION_PREFIX) === 0; });
  names.forEach(function (k) { props.deleteProperty(k); });
  console.log('Deleted ' + names.length + ' translation properties. ' + propertyCount_() + ' properties remain.');
}

function propertyCount_() {
  return Object.keys(PropertiesService.getScriptProperties().getProperties()).length;
}

// Editor-run: how many script properties exist and which kinds (names grouped by prefix, no
// values). The settings page can no longer be edited past 50.
function showPropertyUsage() {
  var groups = {};
  Object.keys(PropertiesService.getScriptProperties().getProperties()).forEach(function (k) {
    var g = k.replace(/[0-9a-f]{32}$/, '<hash>').replace(/\d{4}-\d{2}-\d{2}$/, '<date>');
    groups[g] = (groups[g] || 0) + 1;
  });
  console.log(propertyCount_() + ' script properties (the settings page is read-only past 50): ' + JSON.stringify(groups));
}
