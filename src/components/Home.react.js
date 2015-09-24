import '../css/home.css';

import React from 'react';

import { Link } from 'react-router';

import Species from '../species';
import { CGPS } from '../defaults';

const textStyle = {
  color: CGPS.COLOURS.PURPLE,
};

export default React.createClass({

  // componentDidMount() {
  //   Species.list.map((speciesDef) => {
  //     var element = React.findDOMNode(this.refs[speciesDef.nickname]);
  //     element.style.backgroundImage = ;
  //   });
  // },

  render() {
    return (
      <section>
        <div className="wgsa-home-header mdl-layout__header-row mdl-shadow--2dp">
          <a href="/" className="mdl-layout-title">WGSA</a>
        </div>
        <div className="wgsa-home-section1">
          <div className="wgsa-home-content">
            <h1 style={textStyle}>
              WGSA
            </h1>
            <p>
              Whole Genome Sequence Analysis (WGSA) is a web application for the upload, processing, clustering and exploration of microbial genome assemblies.
            </p>
          </div>
        </div>
        <div className="wgsa-home-section2">
          <h2>Species</h2>
          <div className="wgsa-species-list-container">
            { Species.list.map((speciesDef) => {
              return (
                <div className="wgsa-welcome-card-square mdl-card mdl-shadow--2dp">
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
                      <a href="#" className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" disabled >Coming soon</a>
                    }
                  </div>
                </div>
              );
            }) }
          </div>
        </div>
        <div className="wgsa-home-section3">
          <div className="wgsa-instructions">
            <p className="wgsa-heading">
              Species - specific instances are listed above.
            </p>
            <ol>
              <li>
                Upload genome assemblies + metadata
              </li>
              <li>
                Results generated include:
                <ul>
                  <li>MLST</li>
                  <li>AMR predictions</li>
                  <li>Clustering of genomes</li>
                  <li>Visualise and interact with metadata (Google Maps / Trees etc)</li>
                </ul>
              </li>
              <li>
                Your genomes are placed within a ‘species population reference tree’ allowing comparison to other publicly available genomes.
              </li>
              <li>
                Download processed results/ trees etc for further analysis.
              </li>
            </ol>
          </div>
        </div>
        <div className="wgsa-home-section4">
          <p className="wgsa-nb">
            NOTE: We are in final BETA testing prior to a full release in December 2015 and appreciate your feedback.
          </p>
        </div>
      </section>
    );
  },

});
