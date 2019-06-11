const getUpload = state => state.upload;

export const getAssemblerUsage = state => getUpload(state).usage;

export const getSettingValue = (state, setting) =>
  getUpload(state).settings[setting];
