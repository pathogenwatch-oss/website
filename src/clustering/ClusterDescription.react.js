import { connect } from 'react-redux';

import { getNumberOfGenomesInCluster, getThreshold } from './selectors';

export const getClusterDescription = (numberOfGenomesInCluster, threshold) => (
  `Cluster of ${numberOfGenomesInCluster} at threshold of ${threshold}`
);

const Description = ({ numberOfGenomesInCluster, threshold }) =>
  getClusterDescription(numberOfGenomesInCluster, threshold);

function mapStateToProps(state) {
  return {
    numberOfGenomesInCluster: getNumberOfGenomesInCluster(state),
    threshold: getThreshold(state),
  };
}

export default connect(mapStateToProps)(Description);
