import React from 'react';
import { readAsText } from 'promise-file-reader';

import actions from '../actions';
import ToastActionCreators from '../../actions/ToastActionCreators';

import MetadataUtils from '../../utils/Metadata';
import { API_ROOT } from '../../utils/Api';

import { validateFastaSize, validateFastaContent } from './fasta';

function parseMetadata(row) {
  if (!row) return undefined;

  return {
    ...row,
    assemblyName: row.displayname || row.filename,
    latitude: parseFloat(row.latitude),
    longitude: parseFloat(row.longitude),
  };
}

function flattenCSVs(files) {
  return files.reduce((memo, { data = {} }) => memo.concat(data), []);
}

const FASTA_FILE_EXTENSIONS = [
  '.fa', '.fas', '.fna', '.ffn', '.faa', '.frn', '.fasta', '.contig',
];
const FASTA_FILE_NAME_REGEX = new RegExp(`(${FASTA_FILE_EXTENSIONS.join('|')})$`, 'i');
const CSV_FILE_NAME_REGEX = /(.csv)$/i;

export function mapCSVsToFastas(files) {
  const csvFiles = files.filter(({ name }) => CSV_FILE_NAME_REGEX.test(name));
  const fastaFiles = files.filter(({ name }) => FASTA_FILE_NAME_REGEX.test(name));

  if (!csvFiles.length) {
    return Promise.resolve(
      fastaFiles.map(file => ({ name: file.name, file }))
    );
  }

  return Promise.all(
    csvFiles.map(file =>
      readAsText(file).
        then(contents => MetadataUtils.parseCsvToJson(contents))
    )
  ).then(parsedFiles => flattenCSVs(parsedFiles))
   .then(rows =>
      fastaFiles.reduce((memo, file) => {
        const row = rows.filter(({ filename }) => filename === file.name)[0];
        memo.push({ name: file.name, file, metadata: parseMetadata(row) });
        return memo;
      }, [])
    );
}

function getCustomXHR(filename, dispatch) {
  const xhr = new window.XMLHttpRequest();

  let previousPercent = 0;

  xhr.upload.addEventListener('progress', evt => {
    if (evt.lengthComputable) {
      const percentComplete = (evt.loaded / evt.total) * 100;
      const percentRounded =
        Math.floor(percentComplete / 10) * 10;

      if (percentRounded > previousPercent) {
        dispatch(actions.updateFastaProgress(filename, percentRounded));
        previousPercent = percentRounded;
      }
    }
  }, false);

  return xhr;
}

export function sendToServer({ file, coords }, dispatch) {
  return (
    validateFastaSize(file).
      then(readAsText).
      then(validateFastaContent).
      then(data =>
        $.ajax({
          type: 'POST',
          url: `${API_ROOT}/upload${coords ? `?lat=${coords.lat}&lon=${coords.lon}` : ''}`,
          contentType: 'text/plain; charset=UTF-8',
          data,
          dataType: 'json',
          xhr: () => getCustomXHR(file.name, dispatch),
        })
      )
  );
}

export function showDuplicatesToast(duplicates) {
  ToastActionCreators.showToast({
    message: duplicates.length === 1 ? (
      <span><strong>{duplicates[0].name}</strong> is a duplicate and was not queued.</span>
    ) : (
      <span>{duplicates.length} duplicates were not queued.</span>
    ),
  });
}

function removeViewModel({ id, name, speciesId, metrics, metadata }) {
  return { id, name, speciesId, metrics, metadata };
}

export function createCollection(files, speciesId, metadata) {
  return $.ajax({
    type: 'POST',
    url: `${API_ROOT}/collection`,
    contentType: 'application/json; charset=UTF-8',
    data: JSON.stringify({
      speciesId,
      ...metadata,
      files: files.map(removeViewModel),
    }),
    dataType: 'json',
  });
}
