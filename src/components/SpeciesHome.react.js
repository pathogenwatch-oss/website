import '../css/species-home.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';

import Species from '../species';
import { CGPS } from '../defaults';
import { FASTA_FILE_EXTENSIONS } from '^/utils/File';

const textStyle = {
  color: CGPS.COLOURS.PURPLE,
};
const uploadButtonStyle = {
  position: 'absolute',
  top: '20px',
  right: '20px',
  zIndex: 1,
  color: '#fff',
  fontSize: '18px',
  fontWeight: '400',
};

const iconStyle = {
  color: '#fff',
};

export default React.createClass({

  displayName: 'Passive View',

  propTypes: {
  },


  render() {
    return (
      <section className="wgsa-home wgsa-species-home">
        <div className="wgsa-home-header mdl-layout__header-row">
          <a href="/" className="mdl-layout-title">
            <img src="/assets/img/WGSA.FINAL.svg" />
          </a>
          <div className="mdl-layout-spacer"></div>
          <img className="cgps-logo" src="/assets/img/CGPS.SHORT.FINAL.svg" />
        </div>


        <div className="wgsa-species-home-container">
          <div className="wgsa-home-content">
            <h1><span className="accent">{Species.current.formattedName}</span></h1>
            <p>
              {Species.current.definitionText}
            </p>
          </div>


          <div className="mdl-grid">
            <div className="mdl-cell mdl-cell--12-col wgsa-species-home-collection-list">
              <div className="wgsa-card mdl-shadow--4dp">
                <div className="wgsa-card-heading">Collection List</div>
                <div className="wgsa-card-content">
                  <CollectionList />
                </div>
              </div>
            </div>

            <div className="mdl-cell mdl-cell--12-col wgsa-species-home-other">
              <div className="mdl-grid">
                <div className="mdl-cell mdl-cell--6-col">
                  <div className="wgsa-card mdl-shadow--4dp">
                    <div className="wgsa-card-heading">Upload</div>
                    <div className="wgsa-card-content">
                      <p className="mdl-card__supporting-text">
                        Upload your assemblies to WGSA
                      </p>
                      <p className="mdl-card__supporting-text">
                        Assembled data must be in multi-FASTA format, should be one file per genome and have one of the following extensions:
                      </p>
                      <p className="wgsa-highlight-text">{FASTA_FILE_EXTENSIONS.join(', ')}</p>
                      <Link
                        style={uploadButtonStyle}
                        className="wgsa-upload-review-button mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored mdl-shadow--6dp"
                        to={`/${Species.current.nickname}/upload`}
                        >
                        <i style={iconStyle} className="material-icons">cloud_upload</i>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="mdl-cell mdl-cell--6-col">
                  <div className="wgsa-card mdl-shadow--4dp">
                    <div className="wgsa-card-heading">Download</div>
                    <div className="wgsa-card-content">
                      <p className="mdl-card__supporting-text">
                        Download data for all collections
                      </p>
                      <div className="wgsa-species-home-download-links">
                        <a
                          target="_blank"
                          className="mdl-button mdl-js-button mdl-js-ripple-effect">
                          Metadata
                        </a>
                        <a
                          target="_blank"
                          className="mdl-button mdl-js-button mdl-js-ripple-effect">
                          Kernel
                        </a>
                        <a
                          target="_blank"
                          className="mdl-button mdl-js-button mdl-js-ripple-effect">
                          Tree
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>
    );
  },

});

const CollectionList = React.createClass({

  render() {
    return (
      <CollectionListItem />
    );
  }

});

const CollectionListItem = React.createClass({


  getCollectionListElements() {
    return Array.from(new Array(8), (x,i) => {
      return (
        <li ref={i} className="wgsa-species-collection-list-item">
          <Link
            className="selectButton mdl-button mdl-js-button mdl-js-ripple-effect"
            to={`/${Species.current.nickname}/collection/${i}`}
            >
            <div className="wgsa-species-collection-list-item-content">
              <p>
                <span className="wgsa-collection-author">Glasner. C et al. ({2000 + i})</span>
              </p>
              <p>
                <span className="wgsa-collection-title">Genetic diversity of Staphylococcus aureus in Buruli ulcer</span>
              </p>
            </div>
          </Link>
          <span className="wgsa-species-collection-list-item__utils">
            <a href="http://www.ncbi.nlm.nih.gov/pubmed/25658641"
              target="_blank"
              className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
              PUBMED
            </a>
          </span>
        </li>
      )
    })
  },

  render() {
    return (
      <ul ref="collectionList" className="wgsa-species-collection-list-container">
        {this.getCollectionListElements()}
      </ul>
    );
  }
});