export const getSummary = ({ summary }) => summary;

export const getDeployedOrganismIds =
  ({ summary }) => new Set(summary.deployedOrganisms);
