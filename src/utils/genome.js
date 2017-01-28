import React from 'react';

export function getCounts(genomes, ids) {
  return ids.reduce((memo, id) => {
    const { __isReference, __isCollection } = genomes[id];
    if (__isReference) {
      memo.reference++;
      return memo;
    }
    if (__isCollection) {
      memo.collection++;
      return memo;
    }
    memo.public++;
    return memo;
  }, { reference: 0, collection: 0, public: 0 });
}

export function showCounts(counts) {
  const { reference, collection } = counts;
  return (
    <p style={{ margin: '24px 24px 0' }}>
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
