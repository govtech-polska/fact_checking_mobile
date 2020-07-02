import { call, take, race, fork } from 'redux-saga/effects';

/**
 * Spawns a `saga` on action dispatched to the Store that matches `pattern`.
 * Starts race between `pattern` and arguments passed to `cancelPattern`.
 * Returns a `Task` object.
 *
 * @param {string} pattern action string for `take(pattern)`
 * @param {function} saga a Generator function
 * @param {string} cancelPattern action strings to be passed to `race` effect
 *
 * @example
 *
 *     takeOrCancel('FETCH_USERS', fetchUsers, 'CANCEL_FETCH_USERS', 'SECOND_CANCEL_FETCH_USERS');
 */

export const takeOrCancel = (pattern, saga, ...cancelPattern) => fork(function* () {
  while (true) {
    const action = yield take(pattern);
    yield race([
      call(saga, action),
      ...cancelPattern.map(arg => take(arg)),
    ]);
  }
});
