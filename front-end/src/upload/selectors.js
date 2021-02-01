import { createSelector } from 'reselect';

const getUpload = state => state.upload;

export const getAssemblerUsage = state => getUpload(state).usage;

export const getSettingValue = (state, setting) =>
  getUpload(state).settings[setting];


const getPreviousUploads = state => getUpload(state).previous.uploads;

export const hasIncompleteUploads = createSelector(
  getPreviousUploads,
  uploads => uploads && !!uploads.length && uploads.some(_ => _.total !== _.complete)
);
