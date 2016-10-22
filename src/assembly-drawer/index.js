import './styles.css';

import { connect } from 'react-redux';

import { REMOVE_FASTA } from '../hub/actions';

import AssemblyDetails from './AssemblyDrawer.react';

export const SHOW_ASSEMBLY_DETAILS = 'SHOW_ASSEMBLY_DETAILS';

export function showAssemblyDetails(name) {
  return {
    type: SHOW_ASSEMBLY_DETAILS,
    payload: {
      name,
    },
  };
}

const initialState = { name: null };
export function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case SHOW_ASSEMBLY_DETAILS:
      return {
        name: payload.name,
      };
    case REMOVE_FASTA:
      return state.name === payload.name ? initialState : state;
    default:
      return state;
  }
}

function getSelectedAssembly({ assemblyDrawer, entities: { fastas } }) {
  return assemblyDrawer.name ? fastas[assemblyDrawer.name] : null;
}

function mapStateToProps(state) {
  const assembly = getSelectedAssembly(state);
  const visible = assembly !== null;
  return {
    visible,
    title: visible ? assembly.name : null,
    assembly,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onClose: () => dispatch(showAssemblyDetails(null)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AssemblyDetails);
