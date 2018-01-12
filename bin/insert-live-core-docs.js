const mongoConnection = require('utils/mongoConnection');
const mapLimit = require('promise-map-limit');
const path = require('path');

require('services');
const Genome = require('models/genome');
const Collection = require('models/collection');

const limit = 1;

const [ ,, collection, folder ] = process.argv;

function fetchCollectionAndGenomes() {
  return Collection.findOne({ uuid: collection })
    .then(({ genomes }) => Genome.find({ _id: { $in: genomes } }, { name: 1 }).lean());
}

function formatCore(coreProfile, filter) {
  // const filteredKeys = new Set(filter.filteredAlleles.map(x => x.familyId + x.alleleId));
  const filteredFamilyIds = new Set(filter.filteredAlleles.map(x => x.familyId));
  const doc = [];
  for (const [ familyId, profile ] of Object.entries(coreProfile.kernelProfile)) {
    const alleles = [];
    const alleleIds = new Set();
    for (const { alleleId, complete, detailedMutations, pid, evalue, qId, qPos, refPos } of Object.values(profile.alleles)) {
      alleles.push({
        id: alleleId,
        complete,
        pid: null,
        evalue: null,
        qid: qId,
        qstart: Math.min(qPos.start, qPos.stop),
        qstop: Math.max(qPos.start, qPos.stop),
        rstart: Math.min(refPos.start, refPos.stop),
        rstop: Math.max(refPos.start, refPos.stop),
        mutations: detailedMutations.reduce((mutations, { type, refI, mut }) => {
          if (type === 'S' && /[^ACTG]/i.test(mut) === false) {
            mutations[refI] = mut;
          }
          return mutations;
        }, {}),
        reverse: qPos.start > qPos.stop,
        // exclude duplicated or filtered alleles
        filter: alleleIds.has(alleleId),
        // filterFamily: filteredFamilyIds.has(familyId),
        // duplicate: alleleIds.has(id),
      });
      alleleIds.add(alleleId);
    }
    doc.push({
      id: familyId,
      rlength: profile.length,
      alleles,
      filter: filteredFamilyIds.has(familyId),
    });
  }
  return doc;
}

function createCoreProfile(genomeName) {
  const csDoc = require(path.join(folder, genomeName.replace('.fasta', '.csdoc.json')));
  const fltrDoc = require(path.join(folder, genomeName.replace('.fasta', '.fltrdoc.json')));

  return formatCore(csDoc.json, fltrDoc.json);
}

function updateGenome(genome) {
  return Genome.update(
    { _id: genome._id },
    { 'analysis.core.profile': createCoreProfile(genome.name) }
  );
}

function updateGenomes(genomes) {
  return mapLimit(
    genomes,
    limit,
    updateGenome
  );
}

mongoConnection.connect()
  .then(fetchCollectionAndGenomes)
  .then(updateGenomes)
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
