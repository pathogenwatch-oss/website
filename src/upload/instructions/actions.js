import * as utils from '../utils';

import { showToast } from '../../toast';
import { history } from '../../app/router';

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
        } else {
          dispatch(showToast({ message: 'Sorry, something went wrong 😞' }));
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
