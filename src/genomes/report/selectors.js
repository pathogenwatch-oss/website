export const getReport = state => state.genomes.report;

export const getClusteringStatus = state => getReport(state).clusteringStatus;
export const getClusteringProgress = state => getReport(state).clusteringProgress;
export const getClusters = state => getReport(state).clusters;
