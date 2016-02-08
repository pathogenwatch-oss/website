import MetadataUtils from './Metadata';
import AnalysisUtils from './Analysis';

import UploadStore from '../stores/UploadStore.js';

const FASTA_FILE_EXTENSIONS = [
  '.fa', '.fas', '.fna', '.ffn', '.faa', '.frn', '.fasta', '.contig',
];

const FASTA_FILE_NAME_REGEX = new RegExp(`(${FASTA_FILE_EXTENSIONS.join('|')})$`, 'i');
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
  const results = {
    validFiles: [],
    invalidFiles: [],
  };

  let fileCounter = files.length;

  while (fileCounter > 0) {
    fileCounter = fileCounter - 1;

    const file = files[fileCounter];

    if (isValidFile(file)) {
      results.validFiles.push(file);
    } else {
      results.invalidFiles.push(file);
    }
  }

  return results;
}

function readFile(file, callback) {
  const fileReader = new FileReader();

  fileReader.onload = function handleLoad(event) {
    callback(null, event.target.result);
  };

  fileReader.onerror = function handleError() {
    console.error('[WGSA] Failed to load dropped file: ' + file.name);

    callback(file.name, null);
  };

  fileReader.readAsText(file);
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
      pmid: null,
      date: {
        year: null,
        month: null,
        day: null,
      },
      position: {
        latitude: null,
        longitude: null,
      },
    },
    metrics: {},
  };

  assemblies[assemblyName] = ASSEMBLY_OBJECT;
  return assemblies;
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
  if (fileContent.length) {
    assemblies[fileName].metrics = AnalysisUtils.analyseFasta(fileName, fileContent);
  }
}

function parseCsvFile(file, rawFiles, assemblies) {
  const csvJson = MetadataUtils.parseCsvToJson(file.content);

  if (csvJson.errors.length > 0) {
    console.error('[WGSA] Failed to parse CSV file ' + file.name);
    return;
  }

  csvJson.data.forEach(function (dataRow) {
    if (!dataRow.filename) {
      console.error('[WGSA] Missing assembly filename in metadata file ' + file.name);
      return;
    }

    const filename = dataRow.filename.replace(FASTA_FILE_NAME_REGEX, '');
    initialiseAssemblyObject(filename, assemblies);

    const assemblyName = dataRow.displayname || filename;
    assemblies[filename].metadata.assemblyName = assemblyName;

    for (const colName of Object.keys(dataRow)) {
      if (colName === 'filename' ||
          colName === 'assembly_name' ||
          colName === 'original_isolate_id') {
        continue;
      }

      if (colName === 'latitude' || colName === 'longitude' || colName === 'year' || colName === 'month' || colName === 'day') {
        assemblies[filename].metadata.position.latitude = parseFloat(dataRow.latitude) || null;
        assemblies[filename].metadata.position.longitude = parseFloat(dataRow.longitude) || null;
        assemblies[filename].metadata.date.year = parseInt(dataRow.year, 10) || null;
        assemblies[filename].metadata.date.month = parseInt(dataRow.month, 10) || null;
        assemblies[filename].metadata.date.day = parseInt(dataRow.day, 10) || null;
      } else {
        assemblies[filename].metadata[colName] = dataRow[colName] || null;
      }
    }
  });
}

function handleFileContents(fileContents, rawFiles, assemblies) {
  fileContents.forEach(function parseFileContent(file) {
    if (isCsvFile(file)) {
      parseCsvFile(file, rawFiles, assemblies);
    } else if (isFastaFile(file)) {
      parseFastaFile(file, rawFiles, assemblies);
    } else {
      console.warn('[WGSA] Unsupported file type: ' + file.name);
    }
  });
}

function parseFile(files, callback) {
  const rawFiles = {};
  const assemblies = UploadStore.getAssemblies();

  const validatedFiles = validateFiles(files);

  readFiles(validatedFiles.validFiles, function handleReadFiles(error, fileContents) {
    if (error) {
      console.error('[WGSA] Failed to read files');
      callback(error);
      return;
    }

    handleFileContents(fileContents, rawFiles, assemblies);

    callback(null, rawFiles, assemblies);
  });
}

onmessage = function(event) {
  parseFile(event.data.files, (error, rawFiles, assemblies) => {
    postMessage({ error, rawFiles, assemblies });
  });
}
