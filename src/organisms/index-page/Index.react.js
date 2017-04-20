import './styles.css';

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { FormattedName, taxIdMap } from '../index';
import { CardMetadata } from '../../card';

import { getWgsaOrganisms, getOtherOrganisms } from '../selectors';

import { fetchSummary } from '../actions';

function mapStateToProps(state) {
  return {
    wgsaOrganisms: getWgsaOrganisms(state),
    otherOrganisms: getOtherOrganisms(state),
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
    const { wgsaOrganisms, otherOrganisms } = this.props;
    return (
      <div className="wgsa-page">
        <div className="wgsa-page-margin mdl-grid">
          <div className="mdl-cell mdl-cell--12-col">
            <h1 className="wgsa-page-divider wgsa-page-title">Organisms</h1>
            <h2 className="wgsa-section-title">WGSA Organisms</h2>
          </div>
          { wgsaOrganisms.map(({ organismId, totalCollections, totalGenomes }) =>
              <div key={organismId} className="wgsa-organism-card wgsa-card wgsa-card--bordered mdl-cell mdl-cell--3-col">
                <h3 className="wgsa-section-title">
                  <FormattedName organismId={organismId} fullName />
                </h3>
                <CardMetadata icon="collections" title="Collections">
                  <Link to={`/collections?organismId=${organismId}`} title="Browse Collections">
                    {totalCollections} Collection{totalCollections === 1 ? '' : 's'}
                  </Link>
                </CardMetadata>
                <CardMetadata icon="insert_drive_file" title="Genomes">
                  <Link to={`/genomes?organismId=${organismId}`} title="Browse Genomes">
                    {totalGenomes} Genome{totalGenomes === 1 ? '' : 's'}
                  </Link>
                </CardMetadata>
                <footer className="wgsa-card-footer">
                  <Link
                    className="mdl-button mdl-button--primary wgsa-button--text"
                    to={`/organisms/${taxIdMap.get(organismId).nickname}`}
                  >
                    Organism Home
                  </Link>
                </footer>
              </div>
            ) }
            <h2 className="wgsa-section-title mdl-cell mdl-cell--12-col">Other Organisms</h2>
            { otherOrganisms.map(({ organismId, organismName, totalGenomes }) =>
                <div key={organismId} className="wgsa-organism-card wgsa-card wgsa-card--bordered mdl-cell mdl-cell--3-col">
                  <h3 className="wgsa-section-title">
                    {organismName}
                  </h3>
                  <CardMetadata icon="insert_drive_file" title="Genomes">
                    <Link to={`/genomes?organismId=${organismId}`} title="Browse Genomes">
                      {totalGenomes} Genome{totalGenomes === 1 ? '' : 's'}
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
