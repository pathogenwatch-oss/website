import './styles.css';

import { connect } from 'react-redux';

import { REMOVE_GENOME } from '../genomes/actions';

import GenomeDrawer from './GenomeDrawer.react';

export const SHOW_GENOME_DETAILS = 'SHOW_GENOME_DETAILS';

export function showGenomeDrawer({ id }) {
  return {
    type: SHOW_GENOME_DETAILS,
    payload: {
      id,
    },
  };
}

const initialState = { id: null };
export function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case SHOW_GENOME_DETAILS:
      return {
        id: payload.id,
      };
    case REMOVE_GENOME:
      return state.id === payload.id ? initialState : state;
    default:
      return state;
  }
}

function getSelectedGenome({ genomeDrawer, genomes }) {
  const { entities } = genomes;
  return genomeDrawer.id ? entities[genomeDrawer.id] : null;
}

function mapStateToProps(state) {
  const genome = getSelectedGenome(state);
  console.log(genome);
  const visible = genome !== null;
  return {
    visible,
    title: visible ? genome.name : null,
    genome,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onClose: () => dispatch(showGenomeDrawer({ id: null })),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GenomeDrawer);
