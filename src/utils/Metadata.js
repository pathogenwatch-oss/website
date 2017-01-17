/* eslint no-param-reassign: ["error", { "props": false }] */

import Papa from 'papaparse';

function convertFieldNamesToLowerCase(row) {
  const fieldNames = Object.keys(row);
  let fieldNamesCounter = 0;
  const cleanRow = {};

  while (fieldNamesCounter < fieldNames.length) {
    const fieldName = fieldNames[fieldNamesCounter];
    cleanRow[fieldName.toLowerCase()] = row[fieldName];
    fieldNamesCounter = fieldNamesCounter + 1;
  }

  return cleanRow;
}

function transformRawCsv(rows) {
  return rows.map(
    convertFieldNamesToLowerCase
  );
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

  results.data = transformRawCsv(results.data);
  return results;
}


function convertDateObjectToCustomObject(date) {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1, // converts months from 0-11 to 1-12
    day: date.getDate(),
  };
}

function fixDateFormats(collection) {
  const { assemblies } = collection;
  Object.keys(assemblies).forEach(assemblyId => {
    const assembly = assemblies[assemblyId];

    if (assembly.metadata.datetime) {
      assembly.metadata.date = convertDateObjectToCustomObject(new Date(assembly.metadata.datetime));
    }
  });
  return collection;
}

function isValid({ date }) {
  const thisYear = new Date().getFullYear();

  if (!date) {
    return true;
  }

  const { day, month, year } = date;

  if (day && (day < 1 || day > 31 || !month || !year)) {
    return false;
  }

  if (month && (month < 1 || month > 12 || !year)) {
    return false;
  }

  if (year && (year < 1900 || year > thisYear)) {
    return false;
  }

  return true;
}

function fixPositions(collection) {
  const { assemblies } = collection;
  Object.keys(assemblies).forEach(assemblyId => {
    const { metadata } = assemblies[assemblyId];
    if (metadata.geography) {
      metadata.position = metadata.geography.position;
    }
  });
  return collection;
}

export default {
  parseCsvToJson,
  fixDateFormats,
  isValid,
  fixPositions,
};
