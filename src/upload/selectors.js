const getUpload = state => state.upload;

export const getAssemblerUsage = state => getUpload(state).usage;
