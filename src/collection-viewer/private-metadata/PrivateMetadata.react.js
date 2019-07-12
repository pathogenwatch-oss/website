import React from 'react';
import { readAsText } from 'promise-file-reader';
import Menu from 'libmicroreact/menu';

import DropArea from '~/components/drop-area';
import Fade from '~/components/fade';

import { CSV_FILENAME_REGEX, parseCsvToJson, parseMetadata } from '~/utils/Metadata';

class Button extends React.Component {
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

export default function ({ addMetadata, numberOfRows, clearMetadata }) {
  const [ isOpen, toggleIsOpen ] = React.useState(false);
  const [ csvError, setCsvError ] = React.useState(null);

  function handleFiles(fileList) {
    const file = Array.from(fileList)[0];
    if (!CSV_FILENAME_REGEX.test(file.name)) {
      setCsvError({ message: 'File extension must end with .csv' });
      return;
    }
    readAsText(file)
      .then(parseCsvToJson)
      .then(({ data, errors }) => {
        if (errors.length > 0) {
          const [ error ] = errors;
          setCsvError(error);
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
      button={<Button />}
      caret
      className="pw-viewer-add-metadata-menu"
      open={isOpen}
      toggle={() => { if (!isOpen) setCsvError(null); toggleIsOpen(!isOpen); }}
      toggleOnClick={false}
    >
      <header>
        <h3>Private Metadata</h3>
        <Fade out>
          {isOpen && numberOfRows > 0 &&
            <button key="clear" className="wgsa-link-button secondary" onClick={clearMetadata}>
              <i className="material-icons wgsa-button-icon">remove_circle_outline</i>
              Clear {numberOfRows} added rows
            </button>
          }
        </Fade>
      </header>
      <p>
        Drag and drop a file in <a href="https://en.wikipedia.org/wiki/Comma-separated_values"
          target="_blank"
          rel="noopener"
        >CSV format</a> to add private metadata to this view. These data stay on your computer and are <strong>not saved anywhere else</strong>, so please retain your files.
      </p>
      <p>
        The <strong>name</strong> column is used to match rows to genome records.
        <br />
        <a href="" download="genomes.csv">Download names of the genomes you own in this view</a>.
      </p>
      <p>
        We recommend you include the following columns:
        <br />
        <strong>latitude</strong>, <strong>longitude</strong>, <strong>year</strong>, <strong>month</strong>, <strong>day</strong>
      </p>
      <p>
        When providing a date, month and day are optional. Coordinates should be
        provided in decimal degrees. Extra columns will be included in the metadata table.
      </p>
      {/* <p className="pw-viewer-add-metadata-actions">
        <button className="wgsa-link-button" onClick={clearMetadata}>
          <i className="material-icons wgsa-button-icon">file_download</i>
          Download names
        </button>

      </p> */}
      <DropArea className="pw-viewer-add-metadata-form" onFiles={handleFiles}>
        { csvError ?
          <p key="error">
            { !isNaN(csvError.row) &&
              <React.Fragment>
                There is a problem on row {csvError.row + 1}:
                <br />
              </React.Fragment>
            }
            <strong>{csvError.message}</strong>
          </p> :
          <p key="instruction">Drag and drop or click to add</p>
        }
      </DropArea>
    </Menu>
  );
}
