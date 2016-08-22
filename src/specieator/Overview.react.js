import React from 'react';

import { FASTA_FILE_EXTENSIONS } from '^/utils/File';


export default React.createClass({

  displayName: 'Overview',

  componentDidMount() {
    // componentHandler.upgradeDom();
  },

  componentWillUnmount() {
  },

  render() {
    return (
      <div className="welcome-container wgsa-workspace-click-area">
        <p className="welcome-intro">
          Drag and drop files or click anywhere to begin.
        </p>
        <div className="welcome-card mdl-shadow--2dp">
          <h2 className="welcome-card__title">FASTA Files: Genome Assemblies</h2>
          <p className="mdl-card__supporting-text">
            Drag and drop assemblies onto the page or click anywhere to open the file upload dialog.
          </p>
          <p className="mdl-card__supporting-text">
            Assembled data must be in multi-FASTA format, should be one file per genome and have one of the following extensions:
          </p>
          <p className="wgsa-highlight-text">{FASTA_FILE_EXTENSIONS.join(', ')}</p>
        </div>
        <div className="welcome-card welcome-card--reverse mdl-shadow--2dp">
          <h2 className="welcome-card__title">CSV File: Metadata</h2>
          <p className="mdl-card__supporting-text">
            To include metadata, drag and drop a CSV file onto the page or click anywhere to open the file upload dialog.
          </p>
          <p className="mdl-card__supporting-text">
            Your CSV file MUST contain a column <span className="wgsa-highlight-text">filename</span> with values matching the name of each assembly file.  We strongly recommend you also include the following columns:
          </p>
          <p className="wgsa-highlight-text">day, month, year, latitude, longitude</p>
          <p className="mdl-card__supporting-text">
            You can add any other columns containing metadata you wish to explore within your genome data set.
          </p>
        </div>
      </div>
    );
  },

});
