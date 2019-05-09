import { getAssemblerUsage } from '../selectors';

import { showToast } from '~/toast';
import { addGenomes, uploadErrorMessage } from '../actions';

import { history } from '~/app/router';

import { mapCSVsToGenomes } from '../utils';

export function addFiles(newFiles) {
  const uploadedAt = new Date().toISOString();
  return (dispatch, getState) => {
    const state = getState();
    const usage = getAssemblerUsage(state);

    mapCSVsToGenomes(newFiles, usage)
      .then(parsedFiles => {
        dispatch(addGenomes(parsedFiles, uploadedAt)).then(() =>
          history.push(`/upload/${uploadedAt}`)
        );
      })
      .catch(error => {
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
