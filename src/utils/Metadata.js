/* eslint no-param-reassign: ["error", { "props": false }] */

import Papa from 'papaparse';

function convertFieldNamesToLowerCase(row) {
  const fieldNames = Object.keys(row);
  const cleanRow = {};
  for (const fieldName of fieldNames) {
    if (fieldName.length) {
      cleanRow[fieldName.toLowerCase().trim()] = row[fieldName].trim().replace(/^=*/, '');
    }
  }
  return cleanRow;
}

function transformRawCsv(rows) {
  return rows.map(convertFieldNamesToLowerCase);
}

function parseCsvToJson(csv) {
  const results = Papa.parse(csv, {
    header: true,
    dynamicTyping: false,
    skipEmptyLines: true,
  });

  if (results.errors.length > 0) {
    console.error('[Pathogenwatch] Errors during CSV to JSON conversion:');
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
