export const getSummary = ({ genomes }) => genomes.summary;

export const getVisible = state => getSummary(state).visible;
export const getTotal = state => getSummary(state).total;
