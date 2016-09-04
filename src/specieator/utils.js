/* global $ */
import React from 'react';
import { readAsText } from 'promise-file-reader';

import actions from './actions';
import ToastActionCreators from '../actions/ToastActionCreators';

import { API_ROOT } from '^/utils/Api';

function getCustomXHR(filename, dispatch) {
  const xhr = new window.XMLHttpRequest();

  let previousPercent = 0;

  xhr.upload.addEventListener('progress', evt => {
    if (evt.lengthComputable) {
      const percentComplete = (evt.loaded / evt.total) * 100;
      const percentRounded =
        Math.floor(percentComplete / 10) * 10;

      if (percentRounded > previousPercent) {
        dispatch(actions.updateFastaProgress(filename, percentRounded));
        previousPercent = percentRounded;
      }
    }
  }, false);

  return xhr;
}

export function sendToServer(file, dispatch) {
  return (
    readAsText(file).
      then(data =>
        $.ajax({
          type: 'POST',
          url: `${API_ROOT}/upload`,
          contentType: 'text/plain; charset=UTF-8',
          data,
          dataType: 'json',
          xhr: () => getCustomXHR(file.name, dispatch),
        })
      )
  );
}

export function showDuplicatesToast(duplicates) {
  ToastActionCreators.showToast({
    message: duplicates.length === 1 ? (
      <span><strong>{duplicates[0]}</strong> is a duplicate and was not queued.</span>
    ) : (
      <span>{duplicates.length} duplicates were not queued.</span>
    ),
  });
}

function removeViewModel({ id, name, speciesId, metrics }) {
  return { id, name, speciesId, metrics };
}

export function createCollection(files, speciesId) {
  return $.ajax({
    type: 'POST',
    url: `${API_ROOT}/collection`,
    contentType: 'application/json; charset=UTF-8',
    data: JSON.stringify({
      speciesId,
      files: files.map(removeViewModel),
    }),
    dataType: 'json',
  });
}
