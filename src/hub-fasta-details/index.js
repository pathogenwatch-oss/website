import { connect } from 'react-redux';

import { REMOVE_FASTA } from '../hub/actions';

import FastaDetails from './FastaDetails.react';

export const HUB_VIEW_FASTA_DETAILS = 'HUB_VIEW_FASTA_DETAILS';

export function viewFastaDetails(name) {
  return {
    type: HUB_VIEW_FASTA_DETAILS,
    name,
  };
}

export function selectedFasta(state = null, { type, payload }) {
  switch (type) {
    case HUB_VIEW_FASTA_DETAILS:
      return payload.name;
    case REMOVE_FASTA:
      return state === payload.name ? null : state;
    default:
      return state;
  }
}

export function getSelectedFasta({ hub, entities: { fastas } }) {
  return hub.selectedFasta ? fastas[hub.selectedFasta] : null;
}

function mapStateToProps(state) {
  const fasta = getSelectedFasta(state);
  return {
    fasta,
    isOpen: fasta !== null,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    closeMenu: () => dispatch(viewFastaDetails(null)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FastaDetails);
