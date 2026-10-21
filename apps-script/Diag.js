// Temporary diagnostic (CMP-026 staging checks): shows the real error behind a SERVER_ERROR.
// No personal data is read: only the Events tab. Removed before the PR is opened.

function diagEventsError() {
  try {
    var out = JSON.parse(handleEvents_({ lang: 'es' }).getContent());
    console.log('handleEvents_ ok=' + out.ok + ', events=' + (out.data ? out.data.events.length : 'none'));
  } catch (e) {
    console.log('handleEvents_ threw: ' + e.name + ': ' + e.message);
    console.log(String(e.stack).slice(0, 600));
  }
  try {
    refreshEventsCache();
    console.log('refreshEventsCache OK');
  } catch (e) {
    console.log('refreshEventsCache threw: ' + e.message);
  }
  try {
    var events = readEvents();
    console.log('readEvents: valid=' + events.valid.length + ' invalid=' + events.invalid.length);
  } catch (e) {
    console.log('readEvents threw: ' + e.name + ': ' + e.message + ' ' + String(e.stack).slice(0, 400));
  }
}
