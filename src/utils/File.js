import MetadataUtils from './Metadata';
import AnalysisUtils from './Analysis';

import UploadStore from '../stores/UploadStore.js';

const FASTA_FILE_NAME_REGEX = /(.fa|.fas|.fna|.ffn|.faa|.frn|.fasta|.contig)$/i;
const CSV_FILE_NAME_REGEX = /(.csv)$/i;

function isFastaFile(file) {
  return file.name.match(FASTA_FILE_NAME_REGEX);
}

function isCsvFile(file) {
  return file.name.match(CSV_FILE_NAME_REGEX);
}

function isValidFile(file) {
  return (isFastaFile(file) || isCsvFile(file));
}

function validateFiles(files) {
  var results = {
    validFiles: [],
    invalidFiles: []
  };

  var fileCounter = files.length;
  var file;

  for (; fileCounter !== 0;) {
    fileCounter = fileCounter - 1;

    file = files[fileCounter];

    if (isValidFile(file)) {
      results.validFiles.push(file);
    } else {
      results.invalidFiles.push(file);
    }
  }

  return results;
}

function readFile(file, callback) {
  var fileReader = new FileReader();

  fileReader.onload = function handleLoad(event) {
    // console.log('[WGSA] Loaded dropped file: ' + file.name);

    callback(null, event.target.result);
  };

  fileReader.onerror = function handleError() {
    console.error('[WGSA] Failed to load dropped file: ' + file.name);

    callback(file.name, null);
  };

  fileReader.readAsText(file);
}

function sortFilesByName(files) {
  files.sort(function iife(a, b) {
    if (a.name > b.name) {
      return 1;
    } else if (a.name < b.name) {
      return -1;
    } else {
      return 0;
    }
  });

  return files;
}

function parseFiles(files, callback) {
  var rawFiles = {};
  var assemblies = UploadStore.getAssemblies();

  var validatedFiles = validateFiles(files);

  readFiles(validatedFiles.validFiles, function handleReadFiles(error, fileContents) {
    if (error) {
      console.error('[WGSA] Failed to read files');
      callback(error);
      return;
    }

    handleFilesContent(fileContents, rawFiles, assemblies);

    callback(null, rawFiles, assemblies);
  });
}

function initialiseAssemblyObject(assemblyName, assemblies) {
  if (assemblies[assemblyName]) {
    return assemblies;
  }

  const ASSEMBLY_OBJECT = {
    fasta: {
      name: assemblyName,
      assembly: null,
    },
    metadata: {
      assemblyName: assemblyName,
      date: {
        year: null,
        month: null,
        day: null,
      },
      geography: {
        location: null,
        position: {
          latitude: null,
          longitude: null,
        },
      },
    },
    analysis: {},
  };

  assemblies[assemblyName] = ASSEMBLY_OBJECT;
  return assemblies;
}

function handleFilesContent(filesContent, rawFiles, assemblies) {
  filesContent.forEach(function parseFileContent(file) {
    if (isCsvFile(file)) {
      parseCsvFile(file, rawFiles, assemblies);
    } else if (isFastaFile(file)) {
      parseFastaFile(file, rawFiles, assemblies);
    } else {
      console.warn('[WGSA] Unsupported file type: ' + file.name);
    }
  });
}

function parseFastaFile(file, rawFiles, assemblies) {
  const fileName = file.name.replace(FASTA_FILE_NAME_REGEX, '');
  const fileContent = file.content;

  rawFiles[fileName] = {
    name: fileName,
    content: fileContent,
  };

  initialiseAssemblyObject(fileName, assemblies);
  assemblies[fileName].fasta.assembly = fileContent;
  assemblies[fileName].analysis = analyseFasta(fileName, fileContent);
}

function parseCsvFile(file, rawFiles, assemblies) {
  const csvJson = MetadataUtils.parseCsvToJson(file.content);

  if (csvJson.errors.length > 0) {
    console.error('[WGSA] Filed to parse CSV file ' + file.name);
    return;
  }

  csvJson.data.forEach(function (dataRow) {
    if (!dataRow.filename) {
      console.error('[WGSA] Missing assembly filename in metadata file ' + file.name);
      return;
    }

    const filename = dataRow.filename.replace(FASTA_FILE_NAME_REGEX, '');
    initialiseAssemblyObject(filename, assemblies);

    const assemblyName = dataRow.assembly_name || dataRow.original_isolate_id || filename;
    assemblies[filename].metadata.assemblyName = assemblyName;

    for (const colName of Object.keys(dataRow)) {
      if (colName === 'filename' ||
          colName === 'assembly_name' ||
          colName === 'original_isolate_id') {
        continue;
      }

      if (colName === 'latitude' || colName === 'longitude' || colName === 'location' || colName === 'year' || colName === 'month' || colName === 'day') {
        assemblies[filename].metadata.geography.position.latitude = parseFloat(dataRow.latitude) || null;
        assemblies[filename].metadata.geography.position.longitude = parseFloat(dataRow.longitude) || null;
        assemblies[filename].metadata.geography.location = dataRow.location || null;
        assemblies[filename].metadata.date.year = parseInt(dataRow.year, 10) || null;
        assemblies[filename].metadata.date.month = parseInt(dataRow.month, 10) || null;
        assemblies[filename].metadata.date.day = parseInt(dataRow.day, 10) || null;
      } else {
        assemblies[filename].metadata[colName] = dataRow[colName] || null;
      }
    }
  });
}

function analyseFasta(assemblyName, fastaFileString) {
  var contigs = AnalysisUtils.extractContigsFromFastaFileString(fastaFileString);
  var totalNumberOfContigs = contigs.length;
  var dnaStrings = AnalysisUtils.extractDnaStringsFromContigs(contigs);
  var assemblyN50Data = AnalysisUtils.calculateN50(dnaStrings);
  var contigN50 = assemblyN50Data['sequenceLength'];
  var sumsOfNucleotidesInDnaStrings = AnalysisUtils.calculateSumsOfNucleotidesInDnaStrings(dnaStrings);
  var totalNumberOfNucleotidesInDnaStrings = AnalysisUtils.calculateTotalNumberOfNucleotidesInDnaStrings(dnaStrings);
  var averageNumberOfNucleotidesInDnaStrings = AnalysisUtils.calculateAverageNumberOfNucleotidesInDnaStrings(dnaStrings);
  var smallestNumberOfNucleotidesInDnaStrings = AnalysisUtils.calculateSmallestNumberOfNucleotidesInDnaStrings(dnaStrings);
  var biggestNumberOfNucleotidesInDnaStrings = AnalysisUtils.calculateBiggestNumberOfNucleotidesInDnaStrings(dnaStrings);

  //AnalysisUtils.validateContigs(contigs);

  // console.log('[WGST] * dev * dnaStrings:');
  // console.dir(dnaStrings);
  // console.log('[WGST] * dev * totalNumberOfNucleotidesInDnaStrings: ' + totalNumberOfNucleotidesInDnaStrings);
  // console.log('[WGST] * dev * averageNumberOfNucleotidesInDnaStrings: ' + averageNumberOfNucleotidesInDnaStrings);
  // console.log('[WGST] * dev * smallestNumberOfNucleotidesInDnaStrings: ' + smallestNumberOfNucleotidesInDnaStrings);
  // console.log('[WGST] * dev * biggestNumberOfNucleotidesInDnaStrings: ' + biggestNumberOfNucleotidesInDnaStrings);

  //window.WGST.upload.stats.totalNumberOfContigs = window.WGST.upload.stats.totalNumberOfContigs + contigs.length;

  return {
    totalNumberOfContigs: totalNumberOfContigs,
    dnaStrings: dnaStrings,
    assemblyN50Data: assemblyN50Data,
    contigN50: contigN50,
    sumsOfNucleotidesInDnaStrings: sumsOfNucleotidesInDnaStrings,

    totalNumberOfNucleotidesInDnaStrings: totalNumberOfNucleotidesInDnaStrings,
    averageNumberOfNucleotidesInDnaStrings: averageNumberOfNucleotidesInDnaStrings,
    smallestNumberOfNucleotidesInDnaStrings: smallestNumberOfNucleotidesInDnaStrings,
    biggestNumberOfNucleotidesInDnaStrings: biggestNumberOfNucleotidesInDnaStrings,
  };
}

function readFiles(files, callback) {
  const results = [];

  files.forEach(function (file) {
    readFile(file, function handleFileContent(error, fileContent) {
      if (error) {
        console.error('[WGSA] Failed to load file: ' + error);
        return;
      }

      results.push({
        name: file.name,
        content: fileContent,
      });

      if (results.length === files.length) {
        callback(null, results);
      }
    });
  });
}

module.exports = {
  parseFiles: parseFiles,
  isFastaFile: isFastaFile,
  isCsvFile: isCsvFile,
  validateFiles: validateFiles,
  readFile: readFile,
  sortFilesByName: sortFilesByName,
};
