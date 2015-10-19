import Papa from 'papaparse';
import moment from 'moment';

function convertFieldNamesToLowerCase(dataObject) {
  const fieldNames = Object.keys(dataObject);
  let fieldNamesCounter = 0;
  const dataObjectWithLowerCaseFieldNames = {};

  while (fieldNamesCounter < fieldNames.length) {
    const fieldName = fieldNames[fieldNamesCounter];
    dataObjectWithLowerCaseFieldNames[fieldName.toLowerCase()] = dataObject[fieldName];
    fieldNamesCounter = fieldNamesCounter + 1;
  }

  return dataObjectWithLowerCaseFieldNames;
}

function parseCsvToJson(csv) {
  const results = Papa.parse(csv, {
    header: true,
    dynamicTyping: false,
    skipEmptyLines: true,
  });

  if (results.errors.length > 0) {
    console.error('[WGSA] Errors during CSV to JSON conversion:');
    console.dir(results.errors);
  }

  results.data = results.data.map(convertFieldNamesToLowerCase);
  return results;
}

function getFormattedDateString({ year, month, day }) {
  if (year && !month && !day) {
    return year;
  }

  if (year && month && !day) {
    return moment(`${year}-${month}`, 'YYYY-MM').format('MMMM YYYY');
  }

  if (year && month && day) {
    return moment(`${year}-${month}-${day}`, 'YYYY-MM-DD').format('Do MMMM YYYY');
  }

  return '';
}

function convertDateObjectToCustomObject(date) {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
}

function fixMetadataDateFormatInCollection({ assemblies }) {
  Object.keys(assemblies).forEach(function (assemblyId) {
    const assembly = assemblies[assemblyId];

    if (assembly.metadata.datetime) {
      assembly.metadata.date = convertDateObjectToCustomObject(new Date(assembly.metadata.datetime));
    }
  });
}

export default {
  parseCsvToJson,
  getFormattedDateString,
  fixMetadataDateFormatInCollection,
};
