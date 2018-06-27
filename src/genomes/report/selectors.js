export const getReport = state => state.genomes.report;

export const getClusteringStatus = state => getReport(state).clusteringStatus;
export const getClusteringThreshold = state => getReport(state).clusteringThreshold || 25;
export const getClusteringProgress = state => getReport(state).clusteringProgress || 0;
export const getClusters = state => getReport(state).clusters || {};
