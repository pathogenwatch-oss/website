import '../css/home.css';

import React from 'react';

import { Link } from 'react-router';

import staph from '../species/saureus';
import { CGPS } from '^/defaults';

export default React.createClass({

  render() {
    return (
      <section className="wgsa-home">
        <header className="wgsa-home__intro mdl-shadow--2dp">
          <img src="/assets/img/WGSA.FINAL.svg" className="wgsa-logo" />
          <h1>Whole Genome Sequence Analysis</h1>
          <p>
            A web application for the processing, clustering and exploration of microbial genome assemblies.
          </p>
          <Link to="/saureus/upload" className="mdl-button mdl-button--colored mdl-button--raised wgsa-cta">
            Get started with {staph.formattedName}
          </Link>
        </header>
        <div className="wgsa-home__features">
          <div className="mdl-grid mdl-grid--no-spacing">
            <div className="wgsa-features-card mdl-shadow--2dp mdl-cell">
              <p>
                Upload genome assemblies and metadata, or view all publicly available genomes.
              </p>
            </div>
            <div className="mdl-cell mdl-cell--6-col wgsa-feature-icons">
              <span className="wgsa-file-icon">
                <i className="material-icons" style={{ color: CGPS.COLOURS.PURPLE }}>insert_drive_file</i>
                .fasta
              </span>
              <span className="wgsa-file-icon">
                <i className="material-icons" style={{ color: CGPS.COLOURS.GREEN }}>insert_drive_file</i>
                .csv
              </span>
            </div>
          </div>
          <div className="mdl-grid mdl-grid--no-spacing">
            <div className="mdl-cell mdl-cell--6-col wgsa-feature-icons">
              <i className="material-icons wgsa-result-icon">check_circle</i>
              <i className="material-icons wgsa-result-icon">check_circle</i>
              <i className="material-icons wgsa-result-icon">radio_button_unchecked</i>
            </div>
            <div className="wgsa-features-card wgsa-features-card--reverse mdl-shadow--2dp mdl-cell">
              <p>Generate results including MLST, AMR predictions, clustering of genomes, and interactive visualisation of metadata.</p>
            </div>
          </div>
          <div className="mdl-grid mdl-grid--no-spacing">
            <div className="wgsa-features-card mdl-shadow--2dp mdl-cell mdl-cell--6-col">
              <p>Compare results with publicly available genomes within a species reference tree.</p>
            </div>
            <div className="mdl-cell mdl-cell--6-col wgsa-feature-icons">
              <i className="material-icons wgsa-compare-icon" style={{ color: CGPS.COLOURS.PURPLE_LIGHT }}>nature_people</i>
            </div>
          </div>
          <div className="mdl-grid mdl-grid--no-spacing">
            <div className="mdl-cell mdl-cell--6-col wgsa-feature-icons">
              <span className="wgsa-menu-button mdl-button">
                <i className="wgsa-button-icon material-icons">file_download</i>
                <span>Downloads</span>
              </span>
            </div>
            <div className="wgsa-features-card wgsa-features-card--reverse mdl-shadow--2dp mdl-cell mdl-cell--6-col">
              <p>Download processed results for further analysis.</p>
            </div>
          </div>
        </div>
        <footer>
          <div className="wgsa-footer-content">
            <img className="associate-logo" src="/assets/img/wellcome_trust_logo.png" />
            <img className="associate-logo" src="/assets/img/imperial_logo.png" />
          </div>
          <a className="contact-email" href="mailto:cgps@sanger.ac.uk">cgps@sanger.ac.uk</a>
          <p className="copyright">© 2015 Centre for Genomic Pathogen Surveillance</p>
        </footer>
      </section>
    );
  },

});
