var DataUtils = require('./Data');
var AnalysisUtils = require('./Analysis');
var assign = require('object-assign');
import UploadStore from '../stores/UploadStore.js';

var FASTA_FILE_NAME_REGEX = /^.+(.fa|.fas|.fna|.ffn|.faa|.frn|.fasta|.contig)$/i;
var CSV_FILE_NAME_REGEX = /^.+(.csv)$/i;

function isFastaFile(file) {
  return file.name.match(FASTA_FILE_NAME_REGEX);
};

function isCsvFile(file) {
  return file.name.match(CSV_FILE_NAME_REGEX);
};

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
    // console.log('[Macroreact] Loaded dropped file: ' + file.name);

    callback(null, event.target.result);
  };

  fileReader.onerror = function handleError() {
    console.error('[Macroreact] Failed to load dropped file: ' + file.name);

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
};

function parseFiles(files, callback) {
  var rawFiles = {};
  var assemblies = UploadStore.getAssemblies();

  var validatedFiles = validateFiles(files);

  readFiles(validatedFiles.validFiles, function handleReadFiles(error, fileContents) {
    if (error) {
      console.error('[Macroreact] Failed to read files');
      callback(error);
      return;
    }

    handleFilesContent(fileContents, rawFiles, assemblies);

    callback(null, rawFiles, assemblies);
  });
}

function initialiseAssemblyObject(fileAssemblyId, assemblies) {
  if (assemblies[fileAssemblyId]) {
    return assemblies;
  }

  var ASSEMBLY_OBJECT = {
    fasta: {
      name: null,
      assembly: null
    },
    metadata: {
      fileAssemblyId: null,
      date: {
        year: null,
        month: null,
        day: null
      },
      source: null,
      geography: {
        location: null,
        position: {
          latitude: null,
          longitude: null
        }
      }
    },
    analysis: {}
  };

  assemblies[fileAssemblyId] = ASSEMBLY_OBJECT;
  assemblies[fileAssemblyId].fasta.name = fileAssemblyId;
  assemblies[fileAssemblyId].metadata.fileAssemblyId = fileAssemblyId;

  return assemblies;
}

function handleFilesContent(filesContent, rawFiles, assemblies) {
  filesContent.forEach(function parseFileContent(file) {
    if (isCsvFile(file)) {

      parseCsvFile(file, rawFiles, assemblies);

    } else if (isFastaFile(file)) {

      parseFastaFile(file, rawFiles, assemblies);

    } else {
      console.warn('[Macroreact] Unsupported file type: ' + file.name);
    }
  });
}

function parseFastaFile(file, rawFiles, assemblies) {
  var fileAssemblyId = file.name;
  var fileContent = file.content;

  rawFiles[fileAssemblyId] = {
    name: fileAssemblyId,
    content: fileContent
  };

  assemblies = initialiseAssemblyObject(fileAssemblyId, assemblies);
  assemblies[fileAssemblyId].fasta.assembly = fileContent;
  assemblies[fileAssemblyId].analysis = analyseFasta(fileAssemblyId, fileContent);
}

function parseCsvFile(file, rawFiles, assemblies) {
  var csvString = file.content;
  var csvJson = DataUtils.parseCsvToJson(csvString);
  var dataRows;
  var fileAssemblyId;

  if (csvJson.errors.length > 0) {
    console.error('[Macroreact] Filed to parse CSV file ' + file.name);
    return;
  }

  dataRows = csvJson.data;

  dataRows.forEach(function iife(dataRow) {

    if (! dataRow.filename) {
      console.error('[Macroreact] Invalid assembly filename in metadata file ' + file.name);
      return;
    }

    fileAssemblyId = dataRow.filename;

    assemblies = initialiseAssemblyObject(fileAssemblyId, assemblies);

    assemblies[fileAssemblyId].metadata.assemblyFilename = fileAssemblyId;

    if (dataRow.latitude) {
      assemblies[fileAssemblyId].metadata.geography.position.latitude = parseFloat(dataRow.latitude);
    }

    if (dataRow.longitude) {
      assemblies[fileAssemblyId].metadata.geography.position.longitude = parseFloat(dataRow.longitude);
    }

    if (dataRow.location) {
      assemblies[fileAssemblyId].metadata.geography.location = dataRow.location;
    }

    if (dataRow.year) {
      assemblies[fileAssemblyId].metadata.date.year = parseInt(dataRow.year, 10);
    }

    if (dataRow.month) {
      assemblies[fileAssemblyId].metadata.date.month = parseInt(dataRow.month, 10);
    }

    if (dataRow.day) {
      assemblies[fileAssemblyId].metadata.date.day = parseInt(dataRow.day, 10);
    }

    if (dataRow.source) {
      assemblies[fileAssemblyId].metadata.source = parseInt(dataRow.source, 10);
    }
  });
}

function analyseFasta(fileAssemblyId, fastaFileString) {
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
  var results = [];

  files.forEach(function iife(file) {
    readFile(file, function handleFileContent(error, fileContent) {
      if (error) {
        console.error('[Macroreact] Failed to load file: ' + error);
        return;
      }

      results.push({
        name: file.name,
        content: fileContent
      });

      if (results.length === files.length) {
        callback(null, results);
      }
    });
  });
};

module.exports = {
  parseFiles: parseFiles,
  isFastaFile: isFastaFile,
  isCsvFile: isCsvFile,
  validateFiles: validateFiles,
  readFile: readFile,
  sortFilesByName: sortFilesByName
};
