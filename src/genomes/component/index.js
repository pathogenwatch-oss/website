import { connect } from 'react-redux';

import Genomes from './Genomes.react';

import { toggleAside } from '../../header';
import { fetchGenomes } from '../actions';
import { addFiles } from '../thunks';
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

function mapDispatchToProps(dispatch) {
  return {
    fetchGenomes: () => dispatch(fetchGenomes()),
    toggleAside: isOpen => dispatch(toggleAside(isOpen)),
    addFiles: files => dispatch(addFiles(files)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Genomes);
