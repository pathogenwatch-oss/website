import React from 'react';

import { Link } from 'react-router';

import Species from '../species';
import { CGPS } from '../defaults';

const headingStyle = {
  color: CGPS.COLOURS.PURPLE,
};

const textStyle = {
  color: CGPS.COLOURS.PURPLE,
  textTransform: 'none',
};

const listStyle = {
  margin: 0,
  padding: 0,
};

const listItemStyle = {
  textAlign: 'center',
  listStyle: 'none',
  display: 'block',
  margin: '16px'
};

export default React.createClass({

  componentDidMount() {
    Species.list.map((speciesDef) => {
      var element = React.findDOMNode(this.refs[speciesDef.nickname]);
      element.style.backgroundImage = `url(${speciesDef.imagePath})`;
    });
  },

  render: function () {
    return (
      <section>
        <div className="wgsa-home-header mdl-layout__header-row mdl-shadow--2dp">
          <span className="mdl-layout-title">WGSA</span>
        </div>
        <div className="section1">
          <div className="wgsa-home-content">
            <h2 style={textStyle}>
              WGSA
            </h2>
            <p>
              Whole Genome Sequence Analysis (WGSA) is a web application for the upload, processing, clustering and exploration of microbial genome assemblies.
            </p>
          </div>
        </div>
        <div className="section2">
          <div className="wgsa-species-list-container">
            { Species.list.map((speciesDef) => {
              return (
                <div className="wgsa-welcome-card-square mdl-card mdl-shadow--2dp">
                  <div ref={speciesDef.nickname} className="mdl-card__title mdl-card--expand">
                  </div>
                  <div className="mdl-card__supporting-text">
                    {speciesDef.definitionText}
                  </div>
                  <div className="mdl-card__actions mdl-card--border">
                    <Link
                      to={`/${speciesDef.nickname}/upload`}
                      className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect mdl-shadow--4dp"
                      style={textStyle}>
                      {speciesDef.formattedName}
                    </Link>
                  </div>
                </div>
              );
            }) }
          </div>
        </div>
        <div className="section3">
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
                  <li>
                    MLST
                  </li>
                  <li>
                    AMR predictions
                  </li>
                  <li>
                    Clustering of genomes
                  </li>
                  <li>
                    Visualise and interact with metadata (Google Maps / Trees etc)
                  </li>
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
        <div className="section4">
          <p className="wgsa-nb">
            NOTE: We are in final BETA testing prior to a full release in December 2015 and would encourage you to feedback with issues.
          </p>
        </div>
      </section>
    );
  },

});

