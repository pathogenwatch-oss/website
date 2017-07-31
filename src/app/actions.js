/* global localforage */

import React from 'react';

import { showToast, hideToast } from '../toast';

const preferenceKey = 'hide-archive-wgsa-net-notice';

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
                <p>
                  Welcome to the new <strong>WGSA</strong>!
                  <br />
                  Follow our progress and leave feedback on <a href="https://gitlab.com/cgps/wgsa.net/issues" target="_blank" rel="noopener">our Gitlab page</a>.
                </p>
                <p>
                  The previous version of WGSA will be available at <a href="https://archive.wgsa.net" target="_blank" rel="noopener">archive.wgsa.net</a> for a short time.
                  <br />
                  If you would like your data to be migrated to the new site, please <a href="mailto:cgps@sanger.ac.uk">contact us</a>.
                </p>
                <button className="mdl-button" onClick={() => dontShowAgain(dispatch)}>
                  Don't show this again
                </button>
              </span>
            ),
          })
        );
      });
  };
}
