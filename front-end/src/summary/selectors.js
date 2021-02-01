import { createSelector } from 'reselect';

export const getSummary = state => state.summary;

export const getFormattedSummary = createSelector(
  getSummary,
  summary => {
    const formatted = {};
    for (const [ key, value ] of Object.entries(summary)) {
      formatted[key] = Number(value).toLocaleString();
    }
    return formatted;
  }
);

export const getDeployedOrganismIds = ({ summary }) =>
  new Set(summary.deployedOrganisms);
