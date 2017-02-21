import { connect } from 'react-redux';

import Genomes from './Genomes.react';

import { toggleAside } from '../../header/actions';
import { prefilter } from '../../prefilter/actions';
import { fetchGenomes, fetchSummary } from '../actions';
import { addFiles } from '../thunks';

import { getCollection } from '../../collection-route/selectors';
import { getTotalGenomes } from '../selectors';

import { stateKey } from '../filter';

function mapStateToProps(state) {
  const { genomes } = state;
  return {
    hasGenomes: getTotalGenomes(state) > 0,
    loading: genomes.loading,
    collection: getCollection(state),
  };
}

function mapDispatchToProps(dispatch, props) {
  return {
    fetchSummary: () => dispatch(fetchSummary()),
    fetchGenomes: () => dispatch(fetchGenomes()),
    toggleAside: isOpen => dispatch(toggleAside(isOpen)),
    addFiles: files => dispatch(addFiles(files)),
    prefilter: () => dispatch(prefilter(stateKey, props.prefilter)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Genomes);
