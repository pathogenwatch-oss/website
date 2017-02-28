import React from 'react';

import * as actions from '../actions';

export function undoMoveToBin(genome, dispatch) {
  return {
    action: {
      label: 'Undo',
      onClick: () => dispatch(actions.undoMoveToBin(genome.id)),
    },
    message: (
      <span><strong>{genome.name}</strong> removed.</span>
    ),
  };
}

export function notifyDuplicates(duplicates) {
  return {
    message: duplicates.length === 1 ? (
      <span><strong>{duplicates[0].name}</strong> is a duplicate and was not queued.</span>
    ) : (
      <span>{duplicates.length} duplicates were not queued.</span>
    ),
  };
}
