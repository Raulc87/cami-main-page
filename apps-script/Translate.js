// Spanish -> English for event name and description (FFR-028). The automatic translation is
// kept in script properties keyed by a hash of the Spanish text, so it is recomputed only when
// that text changes. Cami's `nameEn`/`descriptionEn` override it.

var TRANSLATION_PREFIX = 'TR_';

function textHash_(text) {
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, text, Utilities.Charset.UTF_8);
  return bytes.map(function (b) { return ((b < 0 ? b + 256 : b) + 256).toString(16).slice(1); }).join('');
}

// English text for `spanish`: the override if given, else the cached translation, else a new
// one (cached). If the translation service fails the Spanish text is returned.
function englishText_(spanish, override, cache) {
  if (override) return override;
  var key = TRANSLATION_PREFIX + textHash_(spanish);
  if (cache[key]) return cache[key];
  try {
    var translated = LanguageApp.translate(spanish, 'es', 'en');
    if (translated) {
      PropertiesService.getScriptProperties().setProperty(key, translated);
      cache[key] = translated;
      return translated;
    }
  } catch (err) {
    console.error('translate failed: ' + err.name);
  }
  return spanish;
}
