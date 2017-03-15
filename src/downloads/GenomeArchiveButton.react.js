import React from 'react';
import { connect } from 'react-redux';

import DownloadButton from './DownloadButton.react';

import { getDownloadState } from './selectors';

import { downloadGenomeArchive } from './actions';

import { createGenomeArchiveLink } from './utils';

const Button = ({ status, link, filename, label, onClick }) => (
  <DownloadButton
    status={status}
    link={link}
    filename={filename}
    onClick={onClick}
    label={label}
    isArchive
    iconOnly
  />
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

function mapDispatchToProps(dispatch, props) {
  return {
    onClick: () => dispatch(downloadGenomeArchive(props)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Button);
