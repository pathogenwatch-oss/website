import { connect } from 'react-redux';
import { parse } from 'query-string';

import Genomes from './Genomes.react';

import { addFiles } from '../uploads/actions';

import { getTotalGenomes, isWaiting } from '../selectors';
import { isUploading, getTotalErrors } from '../uploads/selectors';

import { updateFilter } from '../filter/actions';

function mapStateToProps(state, { match }) {
  const { prefilter } = match.params;
  return {
    hasGenomes: getTotalGenomes(state) > 0,
    waiting: isWaiting(state),
    isUploading: isUploading(state),
    showErrorSummary: prefilter === 'upload' && getTotalErrors(state) > 0,
    prefilter,
  };
}

function mapDispatchToProps(dispatch, { match, location }) {
  const query = parse(location.search);
  const { prefilter } = match.params;
  return {
    addFiles: files => dispatch(addFiles(files)),
    fetch: () =>
      dispatch(updateFilter({ prefilter, ...query }, false)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Genomes);
