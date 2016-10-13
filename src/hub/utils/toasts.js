import React from 'react';

import actions from '../actions';

export function getUndoRemoveFastaToast(fasta, dispatch) {
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

export function getDuplicatesToastMessage(duplicates) {
  return duplicates.length === 1 ? (
    <span><strong>{duplicates[0].name}</strong> is a duplicate and was not queued.</span>
  ) : (
    <span>{duplicates.length} duplicates were not queued.</span>
  );
}
