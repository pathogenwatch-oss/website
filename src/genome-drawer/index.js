import './styles.css';

import { connect } from 'react-redux';

import { REMOVE_FASTA } from '../genomes/actions';

import GenomeDetails from './GenomeDrawer.react';

export const SHOW_ASSEMBLY_DETAILS = 'SHOW_ASSEMBLY_DETAILS';

export function showGenomeDetails(name) {
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

function getSelectedGenome({ genomeDrawer, hub }) {
  const { fastas } = hub.entities;
  return genomeDrawer.name ? fastas[genomeDrawer.name] : null;
}

function mapStateToProps(state) {
  const genome = getSelectedGenome(state);
  const visible = genome !== null;
  return {
    visible,
    title: visible ? genome.name : null,
    genome,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onClose: () => dispatch(showGenomeDetails(null)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GenomeDetails);
