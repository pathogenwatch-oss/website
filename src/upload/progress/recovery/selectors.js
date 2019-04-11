const getRecovery = ({ upload }) => upload.progress.recovery;

export const getPendingFiles = state => getRecovery(state).pendingFiles;
