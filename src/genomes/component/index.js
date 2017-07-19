import { connect } from 'react-redux';
import { parse } from 'query-string';

import Genomes from './Genomes.react';

import { addFiles } from '../../upload/actions';

import { getTotalGenomes, isWaiting } from '../selectors';

import { updateFilter } from '../filter/actions';

function mapStateToProps(state, { match }) {
  const { prefilter } = match.params;
  return {
    hasGenomes: getTotalGenomes(state) > 0,
    waiting: isWaiting(state),
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
