/* eslint no-param-reassign: ["error", { "props": false }] */

import Papa from 'papaparse';
import validateMetadata from '../../universal/validateMetadata';

export const CSV_FILENAME_REGEX = /(\.csv)$/i;

function convertFieldNamesToLowerCase(row) {
  const cleanRow = {};
  for (const [ key, value ] of Object.entries(row)) {
    if (key.length && typeof value === 'string') {
      cleanRow[key.toLowerCase().trim()] = value.trim().replace(/^=*/, '');
    }
  }
  return cleanRow;
}

function transformRawCsv(rows) {
  return rows.map(convertFieldNamesToLowerCase);
}

export function parseCsvToJson(csv) {
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

export function isValid({ date }) {
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

export function parseMetadata(row) {
  const { displayname, id, name, filename, ...columns } = row;

  const genomeName = displayname || name || id || filename;

  const { year, month, day, latitude, longitude, pmid, ...rest } = columns;

  const userDefined = {};
  for (const [ key, value ] of Object.entries(rest)) {
    if (!value.length) continue;
    userDefined[key] = value;
  }

  const values = { name: genomeName, userDefined };

  if (year) values.year = parseInt(year, 10);
  if (month) values.month = parseInt(month, 10);
  if (day) values.day = parseInt(day, 10);
  if (latitude) values.latitude = parseFloat(latitude);
  if (longitude) values.longitude = parseFloat(longitude);
  if (pmid) values.pmid = pmid;

  validateMetadata(values);

  return values;
}

export default {
  parseCsvToJson,
  isValid,
};
