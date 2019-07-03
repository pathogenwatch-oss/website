import React from 'react';
import { readAsText } from 'promise-file-reader';

import DropArea from '~/components/drop-area';

import MetadataUtils, { CSV_FILENAME_REGEX, parseMetadata } from '~/utils/Metadata';

export default function ({ addMetadata }) {
  function handleFiles(fileList) {
    const file = Array.from(fileList)[0];
    if (!CSV_FILENAME_REGEX.test(file.name)) return;
    readAsText(file)
      .then(contents => MetadataUtils.parseCsvToJson(contents))
      .then(({ data, errors }) => {
        if (errors.length > 0) {
          // const [ { row, message } ] = errors;
          // TODO: handle errors
          return;
        }
        addMetadata(data.map(row => {
          const parsed = parseMetadata(row);
          return {
            ...parsed,
            position: {
              latitude: parsed.latitude,
              longitude: parsed.longitude,
            },
          };
        }));
      });
  }

  return (
    <DropArea onFiles={handleFiles}>
      <p>Upload private metadata</p>
    </DropArea>
  );
}
