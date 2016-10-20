import './styles.css';

import { connect } from 'react-redux';

import { REMOVE_FASTA } from '../hub/actions';

import AssemblyDetails from './AssemblyDetails.react';

export const SHOW_ASSEMBLY_DETAILS = 'SHOW_ASSEMBLY_DETAILS';

export function showAssemblyDetails(name) {
  return {
    type: SHOW_ASSEMBLY_DETAILS,
    payload: {
      name,
    },
  };
}

export function reducer(state = null, { type, payload }) {
  switch (type) {
    case SHOW_ASSEMBLY_DETAILS:
      return payload.name;
    case REMOVE_FASTA:
      return state === payload.name ? null : state;
    default:
      return state;
  }
}

export function getSelectedAssembly({ assemblyDetail, entities: { fastas } }) {
  return assemblyDetail ? fastas[assemblyDetail] : null;
}

function mapStateToProps(state) {
  const assembly = getSelectedAssembly(state);
  return {
    assembly,
    isOpen: assembly !== null,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    closeDialog: () => dispatch(showAssemblyDetails(null)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AssemblyDetails);
