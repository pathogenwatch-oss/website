import { connect } from 'react-redux';

import Genomes from './Genomes.react';

import { toggleAside } from '../../header/actions';
import { addFiles } from '../uploads/actions';

import { getTotalGenomes, isWaiting } from '../selectors';
import { isUploading, getTotalErrors } from '../uploads/selectors';

import { updateFilter } from '../filter/actions';

function mapStateToProps(state, { prefilter }) {
  return {
    hasGenomes: getTotalGenomes(state) > 0,
    waiting: isWaiting(state),
    isUploading: isUploading(state),
    showErrorSummary: prefilter === 'upload' && getTotalErrors(state) > 0,
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
