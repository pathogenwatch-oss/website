import React from 'react';

export function showCounts(counts) {
  const { reference, collection } = counts;
  return (
    <p>
      { reference ? <strong>{reference} Reference</strong> : null }
      { (reference && collection) ? (<span>,&nbsp;</span>) : null }
      { collection ? (
          <strong style={{ color: '#673c90' }}>
            {collection} Collection
          </strong>
        ) : null }
      { (collection && counts.public) ? (<span>,&nbsp;</span>) : null }
      { counts.public ? `${counts.public} Public` : null }
    </p>
  );
}
