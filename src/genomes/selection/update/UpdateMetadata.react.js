import React from 'react';
import { connect } from 'react-redux';

import DownloadLink from '../download/DownloadLink.react';
import DropArea from './DropArea.react';

import { toggleDropdown } from '../actions';
import { updateGenome } from '../../../upload/progress/actions';

import { getServerPath } from '../../../utils/Api';
import { getSelectedGenomeIds } from '../selectors';

const UpdateMetadata = ({ ids, goBack, update }) => (
  <div className="wgsa-dropdown">
    <header className="wgsa-dropdown-header">Update Metadata</header>
    <div className="wgsa-dropdown-content pw-update-metadata">
      <p className="pw-update-metadata-warning">
        <i className="material-icons">warning</i>
        This will overwrite existing data
      </p>
      <DownloadLink
        className="pw-update-metadata-link"
        link={getServerPath('/download/genome/metadata')}
        ids={ids}
      >
        1. Download existing metadata for selected genomes
      </DownloadLink>
      <DropArea update={update} />
    </div>
    <footer className="wgsa-dropdown-footer">
      <button className="mdl-button" onClick={goBack}>
        Go back
      </button>
    </footer>
  </div>
);

function mapStateToProps(state) {
  return {
    ids: getSelectedGenomeIds(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    goBack: () => dispatch(toggleDropdown('selection')),
    update: (id, metadata) => dispatch(updateGenome(id, metadata)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateMetadata);
