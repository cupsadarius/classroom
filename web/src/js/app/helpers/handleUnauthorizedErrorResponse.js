/* @flow */
import AuthActions from '../actions/AuthActions.js';

export let handleUnauthorizedErrorResponse = () => {
    AuthActions.logout();
};
