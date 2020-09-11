const mongoConnection = require('utils/mongoConnection');
const argv = require('named-argv');
const mapLimit = require('promise-map-limit');
const User = require('models/user');
const { getTasksByOrganism } = require('manifest');
const Genome = require('models/genome');
const Analysis = require('models/analysis')

const { doIt = false } = argv.opts;
const limit = 1000;

var count = 0;
// Script compares an old and new version of speciator for a set of assemblies and deletes all tasks for those that have
// changed species from the cache.
// It shouldn't matter if the genome record has already been updated to the latest speciator version, it will use the
// analysis results directly to identify which task results to clear from the cache
function fetchGenomes(query) {
  return Genome.find(query, { 'fileId': 1, '_user': 1, 'analysis.speciator': 1 }).lean();
}

function fetchRecords(fileIds, task, version) {
  return Analysis.find({ fileId: { $in: fileIds }, task, version, }, { fileId: 1, results: 1 }).lean();
}

function hasFlags(task) {
  const { flags = {} } = task;
  return Object.keys(flags).length > 0;
}

async function cleanGenomeCache(genome, newAnalysis, oldAnalysis) {
  const { analysis = {} } = genome;
  const { speciator = {} } = analysis;

  if (!newAnalysis) {
    return;
  }
  // If not in records, speciesId has changed or it's a non-species level organism full update anyway
  if (!oldAnalysis || (oldAnalysis && (newAnalysis.speciesId !== oldAnalysis.speciesId || (speciator.organismId !== speciator.speciesId && newAnalysis.taxId !== speciator.organismId)))) {
    count = count + 1;
    console.log(`${count} ${genome.fileId}`);
    // console.log(`Cleaning ${genome.fileId} from ${!!oldAnalysis ? oldAnalysis.speciesId : 'Very old'} to ${newAnalysis.speciesId}`)
    console.log(`Cleaning ${genome.fileId} from ${!!oldAnalysis ? oldAnalysis.speciesId : 'Very old'} to ${newAnalysis.speciesId}`);
    const user = await User.findById(genome._user, { flags: 1 });
    let oldOrganismId;
    if (!oldAnalysis) {
      oldOrganismId = speciator.organismId;
    } else {
      oldOrganismId = speciator.speciesId !== speciator.organismId ? oldAnalysis.taxId : oldAnalysis.speciesId;
    }
    // const oldOrganismId = !!oldAnalysis ? oldAnalysis.speciesId : speciator.organismId; // This is  not correct - think some more
    const oldSpeciesId = !!oldAnalysis ? oldAnalysis.speciesId : speciator.speciesId;
    const oldGenusId = !!oldAnalysis ? oldAnalysis.genusId : speciator.genusId;
    const oldSuperkingdomId = !!oldAnalysis ? oldAnalysis.superkingdomId : speciator.superkingdomId;

    // Get set of old tasks for that organism.
    const tasks = !user ?
      getTasksByOrganism({
        organismId: oldOrganismId,
        speciesId: oldSpeciesId,
        genusId: oldGenusId,
        superkingdomId: oldSuperkingdomId
      }, { canRun: task => !hasFlags(task) }) :
      getTasksByOrganism({
        organismId: oldOrganismId,
        speciesId: oldSpeciesId,
        genusId: oldGenusId,
        superkingdomId: oldSuperkingdomId
      }, user);

    if (doIt) {
      // Delete the task results from the cache for that fileId
      for (const taskEntry of tasks) {
        await Analysis.deleteOne({ 'fileId': genome.fileId, 'task': taskEntry.task, 'version': taskEntry.version });
      }
    } else {
      console.log("!!!!! DUMMY RUN !!!!!")
    }
  }
}

function cleanCache(genomes, new_analyses, old_analyses) {
  return mapLimit(genomes, limit, genome => cleanGenomeCache(genome, new_analyses[genome.fileId], old_analyses[genome.fileId]));
}

async function fetchSpeciatorRecordsByVersion(fileIds, speciatorVersion) {
  // Allow for multiple old versions to be tested against.
  if (Array.isArray(speciatorVersion)) {
    const aggregated = {};
    for (const version of speciatorVersion) {
      const remainingFileIds = Object.keys(aggregated).length === 0 ? fileIds : fileIds.filter(fileId => aggregated.hasOwnProperty(fileId));
      const records = await fetchRecords(remainingFileIds, 'speciator', speciatorVersion);
      for (const record of records) {
        if (!aggregated.hasOwnProperty(record.fileId)) {
          aggregated[record.fileId] = record.results;
        }
      }
      // aggregated = {...records.reduce((results, result) => results[result.field] = results.result, { } ), ...aggregated};
    }
    return aggregated;
  }

  const records = await fetchRecords(fileIds, 'speciator', speciatorVersion);
  const map = {};
  for (record of records) {
    map[record.fileId] = record.results;
  }
  return map;
  // return records.forEach(record => record).reduce((results, result) => results[result.fileId] = result.results, {});
}

async function main() {
  await mongoConnection.connect();
  const query = JSON.parse(argv.opts.query);
  const genomes = await fetchGenomes(query);
  console.log(`${genomes.length} genomes extracted`)
  console.log(`${genomes.length} genomes extracted`)
  const fileIds = genomes.map(genome => genome.fileId);
  const new_records = await fetchSpeciatorRecordsByVersion(fileIds, argv.opts.newVersion);
  console.log(`${Object.keys(new_records).length} new version records extracted`)
  const old_records = await fetchSpeciatorRecordsByVersion(fileIds, argv.opts.oldVersion);
  console.log(`${Object.keys(old_records).length} old version records extracted`)
  await cleanCache(genomes, new_records, old_records);
  console.log(`${count} genomes with cleaned caches.`)
}


main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
