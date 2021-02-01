import './styles.css';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import PrivateMetadata from './PrivateMetadata.react';

import { addPrivateMetadata, clearPrivateMetadata } from './actions';
import { numberOfMetadataRows } from './selectors';
import { getActiveGenomes } from '../selectors/active';

export const getOwnGenomes = createSelector(
  getActiveGenomes,
  genomes => genomes.filter(_ => _.owner === 'me')
);

function mapStateToProps(state) {
  return {
    numberOfRows: numberOfMetadataRows(state),
    genomes: getOwnGenomes(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addMetadata: data => dispatch(addPrivateMetadata(data)),
    clearMetadata: () => dispatch(clearPrivateMetadata()),
  };
}

function mergeProps({ numberOfRows, genomes }, mappedDispatches) {
  return {
    numberOfRows,
    ...mappedDispatches,
    generateCSV: () => Promise.resolve('name\n'.concat(genomes.map(_ => _.name).join('\n'))),
  };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(PrivateMetadata);
