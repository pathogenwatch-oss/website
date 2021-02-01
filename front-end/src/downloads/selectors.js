export const getDownloads = ({ downloads }) => downloads;

export const getDownloadState = (state, { format, stateKey }) => {
  const downloads = getDownloads(state);
  if (!(format in downloads)) return {};
  return downloads[format][stateKey] || {};
};
