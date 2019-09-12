import './styles.css';

import { connect } from 'react-redux';

import PrivateMetadata from './PrivateMetadata.react';

import { addPrivateMetadata, clearPrivateMetadata } from './actions';
import { numberOfMetadataRows } from './selectors';
import { getOwnGenomes } from '../genomes/selectors';

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
