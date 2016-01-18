import '../css/home.css';

import React from 'react';

import { Link } from 'react-router';

import staph from '../species/saureus';
import { CGPS } from '^/defaults';

export default React.createClass({

  render() {
    return (
      <section className="wgsa-home">
        <header className="mdl-shadow--2dp">
          <div className="wgsa-home-header mdl-layout__header-row">
            <span className="mdl-layout-title">
              <img className="cgps-logo" src="/assets/img/CGPS.SHORT.FINAL.svg" />
            </span>
            <div className="mdl-layout-spacer"></div>
          </div>
          <div className="wgsa-home__intro">
            <img src="/assets/img/WGSA.FINAL.svg" className="wgsa-logo" />
            <h1>Whole Genome Sequence Analysis</h1>
            <p>
              A web application for the processing, clustering and exploration of microbial genome assemblies.
            </p>
            <Link to="/saureus/upload" className="mdl-button mdl-button--colored mdl-button--raised wgsa-cta">
              Get started with {staph.formattedName}
            </Link>
          </div>
        </header>
        <div className="wgsa-home__features">
          <div className="mdl-grid mdl-grid--no-spacing">
            <div className="wgsa-features-card mdl-shadow--2dp mdl-cell">
              <p>
                Upload genome assemblies and metadata, or view all publicly available genomes.
              </p>
            </div>
            <div className="mdl-cell mdl-cell--6-col" style={{ textAlign: 'center' }}>
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
            <div className="mdl-cell mdl-cell--6-col">
            </div>
            <div className="wgsa-features-card wgsa-features-card--reverse mdl-shadow--2dp mdl-cell">
              <p>Generate results including MLST, AMR predictions, clustering of genomes, and interactive visualisation of metadata.</p>
            </div>
          </div>
          <div className="mdl-grid mdl-grid--no-spacing">
            <div className="wgsa-features-card mdl-shadow--2dp mdl-cell mdl-cell--6-col">
              <p>Compare results with other publicly available genomes placed within a ‘species population reference tree’.</p>
            </div>
            <div className="mdl-cell mdl-cell--6-col">
            </div>
          </div>
          <div className="mdl-grid mdl-grid--no-spacing">
            <div className="mdl-cell mdl-cell--6-col">
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
