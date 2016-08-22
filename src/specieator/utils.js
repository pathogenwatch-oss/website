/* global $ */

import { readAsText } from 'promise-file-reader';

import { updateFastaProgress } from './actions';

import { API_ROOT } from '^/utils/Api';


export function uploadFastaUtil(file, dispatch) {
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
