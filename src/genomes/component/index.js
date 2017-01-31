import { connect } from 'react-redux';

import Genomes from './Genomes.react';

import { getCollection } from '../../collection-route/selectors';
import { getTotalFastas } from '../selectors';

function mapStateToProps(state) {
  const { hub } = state;
  return {
    hasFastas: getTotalFastas(state) > 0,
    loading: hub.loading,
    collection: getCollection(state),
  };
}

export default connect(mapStateToProps)(Genomes);
