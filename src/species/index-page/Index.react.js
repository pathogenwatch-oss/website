import './styles.css';

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { FormattedSpeciesName, taxIdMap } from '../index';
import { CardMetadata } from '../../card';

import { getWgsaSpecies, getOtherSpecies } from '../selectors';

import { fetchSummary } from '../actions';

function mapStateToProps(state) {
  return {
    wgsaSpecies: getWgsaSpecies(state),
    otherSpecies: getOtherSpecies(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetch: () => dispatch(fetchSummary()),
  };
}

const Index = React.createClass({

  componentDidMount() {
    this.props.fetch();
  },

  render() {
    const { wgsaSpecies, otherSpecies } = this.props;
    return (
      <div className="wgsa-page">
        <div className="wgsa-page-margin mdl-grid">
          <div className="mdl-cell mdl-cell--12-col">
            <h1 className="wgsa-page-divider wgsa-page-title">Species</h1>
            <h2 className="wgsa-section-title">WGSA Species</h2>
          </div>
          { wgsaSpecies.map(({ speciesId, totalCollections, totalGenomes }) =>
              <div key={speciesId} className="wgsa-card wgsa-section-divider mdl-cell mdl-cell--3-col">
                <h3 className="wgsa-section-title">
                  <FormattedSpeciesName speciesId={speciesId} fullName />
                </h3>
                <CardMetadata icon="collections" title="collections">
                  <Link to={`/collections?speciesId=${speciesId}`} title="Browse collections">
                    {totalCollections} collection{totalCollections === 1 ? '' : 's'}
                  </Link>
                </CardMetadata>
                <CardMetadata icon="bug_report" title="genomes">
                  <Link to={`/genomes?speciesId=${speciesId}`} title="Browse genomes">
                    {totalGenomes} genome{totalGenomes === 1 ? '' : 's'}
                  </Link>
                </CardMetadata>
                <footer className="wgsa-card-footer">
                  <Link
                    className="mdl-button mdl-button--primary wgsa-button--text"
                    to={`/species/${taxIdMap.get(speciesId).nickname}`}
                  >
                    Species Home
                  </Link>
                </footer>
              </div>
            ) }
            <h2 className="wgsa-section-title mdl-cell mdl-cell--12-col">Other Species</h2>
            { otherSpecies.map(({ speciesId, speciesName, totalGenomes }) =>
                <div key={speciesId} className="wgsa-card wgsa-section-divider mdl-cell mdl-cell--3-col">
                  <h3 className="wgsa-section-title">
                    {speciesName}
                  </h3>
                  <CardMetadata icon="bug_report" title="genomes">
                    <Link to={`/genomes?speciesId=${speciesId}`} title="Browse genomes">
                      {totalGenomes} genomes
                    </Link>
                  </CardMetadata>
                </div>
              ) }
        </div>
      </div>
    );
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(Index);
