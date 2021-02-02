/* global localforage */

import React from 'react';

import { showToast, hideToast } from '../toast';

const flag = 'cookie-consent-given';

function dontShowAgain(dispatch) {
  localforage.setItem(flag, true)
    .then(() => dispatch(hideToast()));
}

export function showIntroToast() {
  return dispatch => {
    localforage.getItem(flag)
      .then(consented => {
        if (consented) return;

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
            autohide: false,
          })
        );
      });
  };
}
