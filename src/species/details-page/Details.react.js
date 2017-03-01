import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { taxIdMap } from '../index';

import { getWgsaSpecies } from '../selectors';

import { fetchSummary } from '../actions';

function mapStateToProps(state, { speciesId }) {
  return {
    ...(getWgsaSpecies(state).find(_ => _.speciesId === speciesId.toString())),
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
    const { speciesId, totalGenomes, totalCollections } = this.props;
    const { nickname, formattedName, definitionText, desc, imageAltText } = taxIdMap.get(speciesId);
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
          <div className="wgsa-section-divider mdl-cell mdl-cell--3-col mdl-typography--text-center">
            <p className="wgsa-avatar-image">
              <img src={`/images/${nickname}.jpg`} alt={imageAltText} />
            </p>
            <p><strong>Taxonomy ID:</strong> {speciesId}</p>
            <p>
              <a href={`https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?mode=Info&id=${speciesId}`} target="_blank" rel="noopener">
                View in NCBI taxonomy browser
              </a>
            </p>
          </div>
          <div className="wgsa-section-divider mdl-cell mdl-cell--6-col">
            <h2 className="wgsa-section-title">About</h2>
            <p>{desc}</p>
          </div>
          <div className="mdl-cell mdl-cell--3-col">
            <div className="wgsa-section-divider">
              <h3 className="wgsa-section-title">Collections</h3>
              <Link className="wgsa-figure" to="account/collections" title="Browse collections">
                {totalCollections}
              </Link>
            </div>
            <div className="wgsa-section-divider">
              <h3 className="wgsa-section-title">Genomes</h3>
              <Link className="wgsa-figure" to="account/genomes" title="Browse genomes">
                {totalGenomes}
              </Link>
            </div>
            <div className="wgsa-section-divider">
              <h3 className="wgsa-section-title">Reference Downloads</h3>
              <ul>
                <li><a href={`/download/species/${nickname}/core_representatives.csv`}>Core Representatives</a></li>
                <li><a href={`/download/species/${nickname}/reference_fastas.zip`}>Sequences</a></li>
                <li><a href={`/download/species/${nickname}/reference_annotations.zip`}>Annotations</a></li>
                <li><a href={`/download/species/${nickname}/reference_metadata.csv`}>Metadata</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(Details);
