import { createAsyncConstants } from '../../actions';

import { showToast } from '../../toast';
import { addGenomes } from '../progress/actions';

import { history } from '../../app/router';

import * as api from './api';
import * as utils from '../utils';

export const UPLOAD_VALIDATION_ERROR = 'UPLOAD_VALIDATION_ERROR';

export function uploadValidationError(message) {
  return {
    type: UPLOAD_VALIDATION_ERROR,
    payload: message,
  };
}

export function addFiles(newFiles) {
  const uploadedAt = new Date().toISOString();
  return (dispatch, getState) => {
    const { upload } = getState();
    const { usage } = upload.instructions;

    utils
      .mapCSVsToGenomes(newFiles, uploadedAt, usage)
      .then(parsedFiles => {
        dispatch(addGenomes(parsedFiles, uploadedAt)).then(() =>
          history.push(`/upload/${uploadedAt}`)
        );
      })
      .catch(error => {
        if (error.toast) {
          dispatch(showToast(error.toast));
        } else if (error.message) {
          dispatch(uploadValidationError(error.message));
        } else {
          dispatch(uploadValidationError('Sorry, something went wrong 😞'));
        }
      });
  };
}

export const UPLOAD_SETTING_CHANGED = 'UPLOAD_SETTING_CHANGED';

export function changeUploadSetting(setting, value) {
  return {
    type: UPLOAD_SETTING_CHANGED,
    payload: {
      setting,
      value,
    },
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
