export const getReport = state => state.genomes.report;

export const getClusteringStatus = state => getReport(state).clustering;
