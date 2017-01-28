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

export default {
  parseCsvToJson,
  isValid,
};
