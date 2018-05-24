export const getReport = state => state.genomes.report;

export const getClusteringStatus = state => getReport(state).clusteringStatus;
export const getClusters = state => getReport(state).clusters;
