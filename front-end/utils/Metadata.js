/* eslint-disable no-console */
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

  return !(year && (year < 1900 || year > thisYear));
}

export function parseMetadata(row, fallbackName = row.filename) {
  const { displayname, id, name, ...columns } = row;

  const genomeName = displayname || name || id || fallbackName;

  // eslint-disable-next-line max-len
  const { year, month, day, latitude, longitude, literaturelink, pmid, doi, ...rest } = columns;

  const userDefined = {};
  for (const [ key, value ] of Object.entries(rest)) {
    if (!value.length || key === 'filename') continue;
    userDefined[key] = value;
  }

  const values = { name: genomeName, userDefined };

  if (year) values.year = parseInt(year, 10);
  if (month) values.month = parseInt(month, 10);
  if (day) values.day = parseInt(day, 10);
  if (latitude) values.latitude = parseFloat(latitude);
  if (longitude) values.longitude = parseFloat(longitude);
  if (literaturelink) {
    values.literatureLink = { value: literaturelink };
    if (literaturelink.includes('/')) {
      values.literatureLink.type = 'doi';
    } else {
      values.literatureLink.type = 'pubmed';
    }
    if (doi) values.userDefined.doi = doi;
    if (pmid) values.userDefined.pmid = pmid;
  } else if (pmid) {
    values.literatureLink = { value: pmid, type: 'pubmed' };
    if (doi) values.userDefined.doi = doi;
  } else if (doi) values.literatureLink = { value: doi, type: 'doi' };

  validateMetadata(values);

  return values;
}

export default {
  parseCsvToJson,
  isValid,
};
