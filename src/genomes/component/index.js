import { connect } from 'react-redux';

import Genomes from './Genomes.react';

import { toggleAside } from '../../header/actions';
import { fetchGenomes } from '../actions';
import { addFiles } from '../thunks';

import { getCollection } from '../../collection-route/selectors';
import { getTotalGenomes } from '../selectors';

function mapStateToProps(state) {
  const { genomes } = state;
  return {
    hasGenomes: getTotalGenomes(state) > 0,
    loading: genomes.loading,
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
