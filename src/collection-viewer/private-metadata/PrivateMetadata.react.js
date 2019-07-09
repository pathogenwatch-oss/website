import React from 'react';
import { readAsText } from 'promise-file-reader';

import DropArea from '~/components/drop-area';
import Fade from '~/components/fade';
import ToggleAddMetadata from './ToggleAddMetadata.react';

import MetadataUtils, { CSV_FILENAME_REGEX, parseMetadata } from '~/utils/Metadata';

export default function ({ addMetadata }) {
  const [ isOpen, toggleIsOpen ] = React.useState(false);

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
    <React.Fragment>
      <ToggleAddMetadata toggle={() => toggleIsOpen(!isOpen)} />
      <Fade>
        { isOpen &&
          <DropArea className="pw-viewer-add-metadata-form" onFiles={handleFiles}>
            <p>Upload private metadata</p>
          </DropArea>
        }
      </Fade>
    </React.Fragment>
  );
}
