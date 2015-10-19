import '../css/home.css';

import React from 'react';

import { Link } from 'react-router';

import Species from '../species';
import { CGPS } from '../defaults';

const textStyle = {
  color: CGPS.COLOURS.PURPLE,
};

export default React.createClass({

  render() {
    return (
      <section className="wgsa-home">
        <div className="wgsa-home-header mdl-layout__header-row">
          <a href="/" className="mdl-layout-title">
            <img src="/assets/img/WGSA_logo.png" />WGSA
          </a>
          <div className="mdl-layout-spacer"></div>
          <img className="cgps-logo" src="/assets/img/cgps-logo.svg" />
        </div>
        <div className="wgsa-home-section1">
          <div className="wgsa-home-content">
            <h1><span className="accent">W</span>hole <span className="accent">G</span>enome <span className="accent">S</span>equence <span className="accent">A</span>nalysis</h1>
            <p>
              A web application for the processing, clustering and exploration of microbial genome assemblies.
            </p>
            <p className="wgsa-nb">
              WGSA is in final <em>beta</em> testing prior to full release in December 2015.<br/><a href="mailto:cgps@sanger.ac.uk">Your feedback</a> is appreciated.
            </p>
          </div>
        </div>
        <div className="wgsa-home-section2">
          <h2>Species</h2>
          <ul className="wgsa-species-list-container mdl-grid">
            { Species.list.map((speciesDef) => {
              return (
                <li key={speciesDef.nickname} className="wgsa-welcome-card-square mdl-card mdl-shadow--2dp">
                  <div ref={speciesDef.nickname} style={{ backgroundImage: `url(${speciesDef.imagePath})` }} className="mdl-card__title mdl-card--expand">
                  </div>
                  <div className="mdl-card__supporting-text">
                    {speciesDef.definitionText}
                  </div>
                  <div className="mdl-card__actions mdl-card--border">
                    { speciesDef.active ?
                      <Link
                        to={`/${speciesDef.nickname}/upload`}
                        className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"
                        style={textStyle}>
                        Upload
                      </Link> :
                      <a className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" disabled >Coming soon</a>
                    }
                  </div>
                </li>
              );
            }) }
          </ul>
        </div>
        <div className="wgsa-home-section3">
          <div className="wgsa-features-card mdl-shadow--2dp">
            <h2 className="wgsa-heading">Features</h2>
            <ol>
              <li>
                Upload genome assemblies and metadata.
              </li>
              <li>
                Results generated include:
                <ul>
                  <li>MLST</li>
                  <li>AMR predictions</li>
                  <li>Clustering of genomes</li>
                  <li>Visualisation of metadata on interactive trees and Google Maps</li>
                </ul>
              </li>
              <li>
                Genomes placed within a ‘species population reference tree’ allowing comparison to other publicly available genomes.
              </li>
              <li>
                Download processed results and trees for further analysis.
              </li>
            </ol>
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
