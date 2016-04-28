import '../css/home.css';

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import CircularProgress from './CircularProgress.react';
import Switch from './Switch.react';

import { updateHeader } from '^/actions/header';

import staph from '../species/saureus';
import { CGPS } from '^/defaults';

export default connect()(React.createClass({

  propTypes: {
    dispatch: React.PropTypes.func,
  },

  getInitialState() {
    return {
      isChecked: false,
    };
  },

  componentWillMount() {
    this.props.dispatch(
      updateHeader({
        speciesName: null,
        classNames: null,
        content: (
          <div className="mdl-layout-spacer">
            <img className="cgps-logo" src="/assets/img/CGPS.SHORT.FINAL.svg" />
          </div>
        ),
      })
    );

    document.title = 'WGSA - Whole Genome Sequence Analysis';
  },

  render() {
    return (
      <section className="wgsa-home">
        <header className="wgsa-home__intro mdl-shadow--2dp">
          <img src="/assets/img/WGSA.FINAL.svg" className="wgsa-logo" />
          <h1>Whole Genome Sequence Analysis</h1>
          <p>
            A web application for the processing, clustering and exploration of microbial genome assemblies.
          </p>
          <Link to={`/${staph.nickname}`} className="mdl-button mdl-button--colored mdl-button--raised wgsa-cta">
            Get started with {staph.formattedName}
          </Link>
          <div style={{ fontSize: '16px', margin: '16px 0 0' }}>
            <Link style={{ padding: '0 8px' }} to={`/${staph.nickname}`}>Showcase</Link>
            <Link style={{ padding: '0 8px' }} to={`/${staph.nickname}/upload`} >Create a new collection</Link>
          </div>
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
            <div className="mdl-cell mdl-cell--6-col wgsa-feature-icons wgsa-feature-icons--progress">
              <CircularProgress percentage={Math.ceil(Math.random() * 100)}/>
              <CircularProgress percentage={Math.ceil(Math.random() * 100)}/>
              <CircularProgress percentage={Math.ceil(Math.random() * 100)}/>
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
              <Switch
                id="tree-switcher"
                left={{ title: 'Collection View', icon: 'person' }}
                right={{ title: 'Population View', icon: 'language' }}
                checked
              />
            </div>
          </div>
          <div className="mdl-grid mdl-grid--no-spacing">
            <div className="mdl-cell mdl-cell--6-col wgsa-feature-icons">
              <span className="wgsa-menu-button mdl-button" style={{ padding: '12px 32px', fontSize: '24px', borderRadius: '4px' }}>
                <i className="wgsa-button-icon material-icons" style={{ fontSize: '32px', marginRight: '8px' }}>file_download</i>
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

}));
