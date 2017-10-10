import * as utils from '../utils';

import { showToast } from '../../toast';
import { history } from '../../app';

import { addGenomes } from '../progress/actions';

export function addFiles(newFiles) {
  const uploadedAt = new Date().toISOString();
  return (dispatch) =>
    utils.mapCSVsToGenomes(newFiles, uploadedAt)
      .then(parsedFiles => {
        dispatch(addGenomes(parsedFiles, uploadedAt));
        history.push(`/upload/${uploadedAt}`);
      })
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
