export const getSummary = ({ genomes }) => genomes.summary;

export const getTotal = state => getSummary(state).total;
