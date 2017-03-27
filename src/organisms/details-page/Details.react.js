import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { taxIdMap } from '../index';

import { getWgsaOrganisms } from '../selectors';

import { fetchSummary } from '../actions';

function mapStateToProps(state, { organismId }) {
  return {
    ...(getWgsaOrganisms(state).find(_ => _.organismId === organismId.toString())),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetch: () => dispatch(fetchSummary()),
  };
}

const Details = React.createClass({

  componentDidMount() {
    this.props.fetch();
  },

  render() {
    const { organismId, totalGenomes, totalCollections } = this.props;
    const { nickname, formattedName, definitionText, desc, imageAltText, taxonomy } = taxIdMap.get(organismId);
    return (
      <div className="wgsa-page">
        <div className="wgsa-page-margin mdl-grid">
          <div className="mdl-cell mdl-cell--12-col">
            <div className="wgsa-page-breadcrumb">
              <Link to="/">Back to Home</Link>
            </div>
            <h1 className="wgsa-page-divider wgsa-page-title">{formattedName}</h1>
            <p>{definitionText}</p>
          </div>
          <div className="mdl-cell mdl-cell--3-col">
            <div className="wgsa-section-divider mdl-typography--text-center">
              <p className="wgsa-avatar-image">
                <img src={`/images/${nickname}.jpg`} alt={imageAltText} />
              </p>
              <p><strong>Taxonomy ID:</strong> {organismId}</p>
              <p>
                <a href={`https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?mode=Tree&id=${organismId}`} target="_blank" rel="noopener">
                  View in NCBI taxonomy browser
                </a>
              </p>
            </div>
          </div>
          <div className="mdl-cell mdl-cell--6-col">
            <div className="wgsa-section-divider">
              <h2 className="wgsa-section-title">About</h2>
              {desc}
            </div>
            <div className="wgsa-section-divider">
              <h2 className="wgsa-section-title">Taxonomy</h2>
              <ul>
                {
                  taxonomy.map(({ taxId, scientificName, rank }) =>
                    <li>
                      <a href={`https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?mode=Info&id=${taxId}`} target="_blank" rel="noopener">
                        {scientificName}
                      </a>
                      { rank !== 'no rank' && ` (${rank})` }
                    </li>
                  )
                }
              </ul>
            </div>
          </div>
          <div className="mdl-cell mdl-cell--3-col">
            <div className="wgsa-section-divider">
              <h3 className="wgsa-section-title">Collections</h3>
              <Link className="wgsa-figure" to={`/collections/all?organismId=${organismId}`} title="Browse Collections">
                {totalCollections}
              </Link>
            </div>
            <div className="wgsa-section-divider">
              <h3 className="wgsa-section-title">Genomes</h3>
              <Link className="wgsa-figure" to={`/genomes/all?organismId=${organismId}`} title="Browse Genomes">
                {totalGenomes}
              </Link>
            </div>
            <div className="wgsa-section-divider">
              <h3 className="wgsa-section-title">Reference Downloads</h3>
              <ul>
                <li><a href={`/download/organism/${nickname}/core_representatives.csv`}>Core Representatives</a></li>
                <li><a href={`/download/organism/${nickname}/reference_fastas.zip`}>Sequences</a></li>
                <li><a href={`/download/organism/${nickname}/reference_annotations.zip`}>Annotations</a></li>
                <li><a href={`/download/organism/${nickname}/reference_metadata.csv`}>Metadata</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(Details);
