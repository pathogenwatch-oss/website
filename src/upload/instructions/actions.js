import { createAsyncConstants } from '~/actions';

import { showToast } from '~/toast';
import { addGenomes, uploadErrorMessage } from '../actions';

import { history } from '~/app/router';

import * as api from './api';
import { mapCSVsToGenomes } from '../utils';

export function addFiles(newFiles) {
  const uploadedAt = new Date().toISOString();
  return (dispatch, getState) => {
    const { upload } = getState();
    const { usage } = upload.instructions;

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
          dispatch(uploadErrorMessage('Sorry, something went wrong 😞'));
        }
      });
  };
}

export const UPLOAD_FETCH_ASSEMBLER_USAGE = createAsyncConstants(
  'UPLOAD_FETCH_ASSEMBLER_USAGE'
);

export function fetchAssemblerUsage(token) {
  return {
    type: UPLOAD_FETCH_ASSEMBLER_USAGE,
    payload: {
      promise: api.fetchUsage(token),
    },
  };
}
