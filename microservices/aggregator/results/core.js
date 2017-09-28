const CollectionGenome = require('models/collectionGenome');
const mainStorage = require('services/storage')('main');
const { CORE_RESULT, CORE_RAW_RESULT } = require('utils/documentKeys');

function cleanHits({ id, matches }, partial = false) {
  return {
    partial,
    id,
    matches: matches.map(match => ({
      reversed: match.direction === 'reverse',
      evalue: match.eValue,
      identity: match.sequenceIdentity,
      query: {
        id: match.querySequenceId,
        start: match.querySequenceStart,
        stop: match.querySequenceStop,
      },
      reference: {
        id: match.referenceMatchId,
        start: match.referenceStart,
        stop: match.referenceStop,
        length: match.referenceLength,
      },
    })),
  };
}

function mergeAlleles({ completeAlleles, partialAlleles }) {
  const matches = [];
  for (const allele of completeAlleles) {
    if (allele.numMatches > 0) {
      matches.push(cleanHits(allele));
    }
  }
  for (const allele of partialAlleles) {
    if (allele.numMatches > 0) {
      matches.push(cleanHits(allele, true));
    }
  }
  return matches;
}

module.exports = (name, { assemblyId, documentKeys }) => {
  const { uuid } = assemblyId;
  const resultDocKey = documentKeys.find(_ => _.indexOf(`${CORE_RESULT}_`) === 0);
  const rawResultDocKey = documentKeys.find(_ => _.indexOf(`${CORE_RAW_RESULT}_`) === 0);
  return mainStorage.retrieveMany([ resultDocKey, rawResultDocKey ])
    .then(({ results }) => [ results[resultDocKey], results[rawResultDocKey] ])
    .then(([ result, rawResult ]) => ({
      size: result.kernelSize,
      percentMatched: result.percentKernelMatched,
      percentAssemblyMatched: result.percentAssemblyMatched,
      matches: mergeAlleles(rawResult),
    }))
    .then(result => CollectionGenome.addAnalysisResult(uuid, name, result));
};
