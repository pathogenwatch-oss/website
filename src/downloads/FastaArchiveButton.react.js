import React from 'react';
import { connect } from 'react-redux';

import DownloadIcon from '../components/explorer/DownloadIcon.react';

import { getFastaArchiveFiles } from './selectors';

import { API_ROOT } from '../utils/Api';
import { CGPS } from '../app/constants';
import Species from '../species';

const Button = ({ files, filename }) => (
  <form method="POST" action={`${API_ROOT}/download/fastas`}>
    <input type="hidden" name="files" value={files} />
    <input type="hidden" name="filename" value={filename} />
    <button
      title="Download Assembly"
      className="wgsa-download-button mdl-button mdl-button--icon"
    >
      <DownloadIcon color={CGPS.COLOURS.PURPLE} isArchive />
    </button>
  </form>
);

function mapStateToProps(state) {
  const { collection } = state;
  return {
    files: getFastaArchiveFiles(state),
    filename: `wgsa_${Species.current.nickname}_${collection.id}_fastas`,
  };
}

export default connect(mapStateToProps)(Button);
