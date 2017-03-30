import React from 'react';
import { connect } from 'react-redux';

import DownloadButton from './DownloadButton.react';
import DownloadIcon from './DownloadIcon.react.js';

import { getDownloadState } from './selectors';

import { downloadGenomeArchive } from './actions';

import { createGenomeArchiveLink } from './utils';
import { CGPS } from '../app/constants';
const { COLOURS } = CGPS;

const Button = ({ status, link, filename, title, onClick, disabled }) => (
  <DownloadButton
    status={status}
    link={link}
    filename={filename}
    title={title}
    onClick={onClick}
    disabled={disabled}
  >
    <DownloadIcon
      isArchive
      color={disabled ? COLOURS.GREY_DARK : COLOURS.PURPLE}
    />
  </DownloadButton>
);

Button.PropTypes = {
  genomes: React.PropTypes.array,
  filename: React.PropTypes.string,
  type: React.PropTypes.string,
  label: React.PropTypes.string,
};

function mapStateToProps(state, { ids, filename }) {
  const props = { format: 'genome_archive', stateKey: JSON.stringify(ids) };
  const { status, result } = getDownloadState(state, props);
  return { status, link: createGenomeArchiveLink(result, filename) };
}

function mapDispatchToProps(dispatch, { ids, type }) {
  return {
    onClick: () => dispatch(downloadGenomeArchive(ids, type)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Button);
