import React from 'react';

import actions from '../actions';

export function undoRemoveGenome(genome, dispatch) {
  return {
    action: {
      label: 'Undo',
      onClick: () => dispatch(actions.undoRemoveGenome(genome.id)),
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

export function retryAll(count, onClick) {
  const plural = count > 1;
  return {
    action: {
      onClick,
      label: `Retry${plural ? ' All' : ''}`,
    },
    message: (
      <span>{count} file{plural ? 's' : ''} could not be uploaded.</span>
    ),
  };
}
