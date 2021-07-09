import { showToast } from '~/toast';
import { addGenomes, uploadErrorMessage } from '../actions';

import { history } from '~/app/router';

import { mapCSVsToGenomes } from '../file-utils';

export function addFiles(newFiles) {
  const uploadedAt = new Date().toISOString();
  return (dispatch) => {
    mapCSVsToGenomes(newFiles)
      .then((parsedFiles) => {
        dispatch(addGenomes(parsedFiles, uploadedAt)).then(() =>
          history.push(`/upload/${uploadedAt}`)
        );
      })
      .catch((error) => {
        if (error.toast) {
          dispatch(showToast(error.toast));
        } else if (error.message) {
          dispatch(uploadErrorMessage(error.message));
        } else {
          dispatch(uploadErrorMessage('Sorry, something went wrong.'));
        }
      });
  };
}
