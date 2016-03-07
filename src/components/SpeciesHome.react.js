import '../css/species-home.css';

import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import DownloadIcon from './explorer/DownloadIcon.react';

import { updateHeader } from '^/actions/header';

import { speciesDownloads, speciesPath } from '^/constants/downloads';
import Species from '../species';

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

export default connect()(React.createClass({

  displayName: 'SpeciesHome',

  componentWillMount() {
    this.props.dispatch(
      updateHeader({
        speciesName: null,
        classNames: 'mdl-shadow--3dp',
        content: null,
      })
    );

    document.title = `WGSA | ${Species.current.shortName}`;
  },

  render() {
    return (
      <section className="wgsa-species-home">

        <div className="wgsa-species-home-container">
          <div className="mdl-grid">
            <h1 className="wgsa-species-home-title">{Species.current.formattedName}</h1>

            <div className="mdl-cell mdl-cell--6-col wgsa-species-home-intro">
              <div className="wgsa-card mdl-shadow--2dp">
                <div className="wgsa-card-content">
                  {Species.current.desc ||
                    <p>
                      {Species.current.definitionText}
                    </p>
                  }
                </div>
              </div>
            </div>

            <div className="mdl-cell mdl-cell--6-col wgsa-species-home-collection-list">
              <div className="wgsa-card mdl-shadow--2dp">
                <div className="wgsa-card-heading">Collections</div>
                <div className="wgsa-card-content wgsa-species-collection-list">
                  <CollectionList />
                </div>
              </div>
            </div>

            <div className="mdl-cell mdl-cell--6-col wgsa-species-home-other">
              <div className="wgsa-card wgsa-species-upload-link mdl-shadow--2dp">
                <div className="wgsa-card-heading">Upload</div>
                <div className="wgsa-card-content">
                  <p className="mdl-card__supporting-text">
                    Create your own collection.
                  </p>
                  <Link
                    style={uploadButtonStyle}
                    className="wgsa-upload-review-button mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored mdl-shadow--6dp"
                    to={`/${Species.current.nickname}/upload`}
                    >
                    <i style={iconStyle} className="material-icons">cloud_upload</i>
                  </Link>
                </div>
              </div>
              <div className="wgsa-card mdl-shadow--2dp wgsa-species-downloads">
                <div className="wgsa-card-heading">Downloads</div>
                <div className="wgsa-card-content">
                  <ul className="wgsa-submenu">
                    { speciesDownloads.map(
                      ({ text, filename, serverName }) => (
                        <li className="wgsa-menu__item">
                          <a ref="link"
                            href={`${speciesPath()}/${serverName}`}
                            target="_blank"
                            download={filename}
                            className="wgsa-download-button">
                              <DownloadIcon hasLink />
                              {text}
                          </a>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>
    );
  },

}));

const CollectionList = () => (
  <ul className="wgsa-species-collection-list-container">
    { Species.current.collections.map(({ id, author, title, size, pmid }) => (
      <li key={id} className="wgsa-species-collection-list-item">
        <Link
          className="selectButton mdl-button mdl-js-button mdl-js-ripple-effect"
          to={`/${Species.current.nickname}/collection/${id}`}
          >
          <div className="wgsa-species-collection-list-item-content">
            <header className="wgsa-collection-author">
              {author} - {size} assemblies
            </header>
            <p className="wgsa-collection-title">{title}</p>
          </div>
        </Link>
        <span className="wgsa-species-collection-list-item__utils">
          <a href={`http://www.ncbi.nlm.nih.gov/pubmed/${pmid}`}
            target="_blank"
            className="wgsa-external-link">
            <span>PUBMED</span><i className="material-icons">open_in_new</i>
          </a>
        </span>
      </li>
    ))}
  </ul>
);
