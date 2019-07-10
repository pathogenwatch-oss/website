import React from 'react';
import { readAsText } from 'promise-file-reader';
import Menu from 'libmicroreact/menu';

import DropArea from '~/components/drop-area';

import MetadataUtils, { CSV_FILENAME_REGEX, parseMetadata } from '~/utils/Metadata';

class Toggle extends React.Component {
  render() {
    return (
      <button
        className="mdl-button mdl-button--icon"
        onClick={this.props.onClick}
        ref={el => { this.el = el; }}
        title="Add Metadata"
      >
        <i className="material-icons">note_add</i>
      </button>
    );
  }
}

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
        toggleIsOpen(false);
      });
  }

  return (
    <Menu
      align="right"
      button={<Toggle />}
      caret
      className="pw-viewer-add-metadata-menu"
      open={isOpen}
      toggle={() => toggleIsOpen(!isOpen)}
      toggleOnClick={false}
    >
      <h3>Private Metadata</h3>
      <p>
        Drag and drop a file in <a href="https://en.wikipedia.org/wiki/Comma-separated_values"
          target="_blank"
          rel="noopener"
        >CSV format</a> to add private metadata to this view. These data stay on your computer and are <strong>not saved anywhere else</strong>, so please retain your files.
      </p>
      <p>
        Provide a <strong>name</strong> column to match each row to a genome record in this view. Additional recommended columns are:
      </p>
      <ul className="inline">
        <li>latitude</li>
        <li>longitude</li>
        <li>year</li>
        <li>month</li>
        <li>day</li>
      </ul>
      <p>
        When providing a date, month and day are optional. Coordinates should be
        provided in decimal degrees. Other columns will be included in the metadata table.
      </p>
      <DropArea className="pw-viewer-add-metadata-form" onFiles={handleFiles}>
        <p>Drag and drop or click to add</p>
      </DropArea>
    </Menu>
  );
}
