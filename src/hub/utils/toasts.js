import React from 'react';

import actions from '../actions';

export function undoRemoveFasta(fasta, dispatch) {
  return {
    action: {
      label: 'Undo',
      onClick: () => dispatch(actions.undoRemoveFasta(fasta)),
    },
    message: (
      <span><strong>{fasta.name}</strong> removed.</span>
    ),
  };
}
