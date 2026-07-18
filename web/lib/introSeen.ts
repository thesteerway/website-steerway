/**
 * Module-scoped flag: has the app already been alive in this browser tab?
 * Module state survives client-side navigations but resets on a hard load,
 * so the needle loader plays on refresh/direct visits to the homepage and is
 * skipped when the user navigates home from an internal page (logo click).
 */
let appAlive = false;

export function markAppAlive() {
  appAlive = true;
}

export function isAppAlive() {
  return appAlive;
}
