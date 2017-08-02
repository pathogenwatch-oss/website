import * as utils from '../utils';

import { showToast } from '../../toast';
import { history } from '../../app';

import { processFiles } from '../actions';

export function addFiles(newFiles) {
  const uploadedAt = new Date().toISOString();
  history.push(`/upload/${uploadedAt}`);
  return (dispatch) =>
    utils.mapCSVsToGenomes(newFiles, uploadedAt)
      .then(parsedFiles => dispatch(processFiles(parsedFiles)))
      .catch(error => {
        if (error.toast) {
          dispatch(showToast(error.toast));
        }
      });
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
