/* global $ */
import React from 'react';
import { readAsText } from 'promise-file-reader';

import { updateFastaProgress } from './actions';
import { addFastas, uploadFasta } from './actions';
import ToastActionCreators from '../actions/ToastActionCreators';

import { API_ROOT } from '^/utils/Api';


function sendToServer(file, dispatch) {
  return (
    readAsText(file).
      then(data =>
        $.ajax({
          type: 'POST',
          url: `${API_ROOT}/specieator`,
          contentType: 'text/plain; charset=UTF-8',
          data,
          dataType: 'json',
          xhr() {
            const xhr = new window.XMLHttpRequest();

            let previousPercent = 0;

            xhr.upload.addEventListener('progress', evt => {
              if (evt.lengthComputable) {
                const percentComplete = (evt.loaded / evt.total) * 100;
                const percentRounded =
                  Math.floor(percentComplete / 10) * 10;

                if (percentRounded > previousPercent) {
                  dispatch(updateFastaProgress(file.name, percentRounded));
                  previousPercent = percentRounded;
                }
              }
            }, false);

            return xhr;
          },
        })
      )
  );
}

export function uploadFile(file, dispatch) {
  dispatch(uploadFasta(file.name, sendToServer(file, dispatch)));
}

function showDuplicatesToast(duplicates) {
  ToastActionCreators.showToast({
    message: duplicates.length === 1 ? (
      <span><strong>{duplicates[0]}</strong> is a duplicate and was not queued.</span>
    ) : (
      <span>{duplicates.length} duplicates were not queued.</span>
    ),
  });
}

export function addFiles(newFiles, existingFiles, dispatch) {
  const duplicates = newFiles.filter(file => file.name in existingFiles);
  const nonDuplicates = newFiles.filter(file => !(file.name in existingFiles));

  if (duplicates.length) showDuplicatesToast(duplicates);
  if (nonDuplicates.length) dispatch(addFastas(nonDuplicates));
}
