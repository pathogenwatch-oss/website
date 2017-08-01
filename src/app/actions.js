/* global localforage */

import React from 'react';

import { showToast, hideToast } from '../toast';

const preferenceKey = 'cookie-consent-given';

function dontShowAgain(dispatch) {
  localforage.setItem(preferenceKey, true)
    .then(() => dispatch(hideToast()));
}

export function showIntroToast() {
  return dispatch => {
    localforage.getItem(preferenceKey)
      .then(hidden => {
        if (hidden) return;

        dispatch(
          showToast({
            message: (
              <span>
                🍪 This website uses cookies for a better browsing experience.
              </span>
            ),
            action: {
              label: <span>That's&nbsp;OK</span>,
              onClick: () => dontShowAgain(dispatch),
            },
            closeButton: false,
          })
        );
      });
  };
}
