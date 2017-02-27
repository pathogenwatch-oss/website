import { connect } from 'react-redux';

import Genomes from './Genomes.react';

import { toggleAside } from '../../header/actions';
import { addFiles } from '../uploads/actions';

import { getTotalGenomes } from '../selectors';
import { isUploading } from '../uploads/selectors';

import { updateFilter } from '../filter/actions';

function mapStateToProps(state) {
  const { genomes } = state;
  return {
    hasGenomes: getTotalGenomes(state) > 0,
    loading: genomes.loading,
    isUploading: isUploading(state),
  };
}

function mapDispatchToProps(dispatch, { prefilter, location }) {
  return {
    toggleAside: isOpen => dispatch(toggleAside(isOpen)),
    addFiles: files => dispatch(addFiles(files)),
    filter: () =>
      dispatch(updateFilter({ prefilter, ...location.query }, false)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Genomes);
