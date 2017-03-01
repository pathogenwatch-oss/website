import './styles.css';

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { FormattedSpeciesName, taxIdMap } from '../index';
import Card, { CardMetadata } from '../../card';

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
      <div className="wgsa-home-page">
        <h2>WGSA Species</h2>
        <section>
          {
            wgsaSpecies.map(({ speciesId, totalCollections, totalGenomes }) =>
              <Card className="wgsa-species-card">
                <h3>
                  <FormattedSpeciesName speciesId={speciesId} />
                </h3>
                <CardMetadata icon="collections" title="collections">
                  <Link to={`/collections?speciesId=${speciesId}`} title="Browse collections">
                    {totalCollections} collections
                  </Link>
                </CardMetadata>
                <CardMetadata icon="bug_report" title="genomes">
                  <Link to={`/genomes?speciesId=${speciesId}`} title="Browse genomes">
                    {totalGenomes} genomes
                  </Link>
                </CardMetadata>
                <Link
                  className="mdl-button mdl-button--primary wgsa-button--text"
                  to={`/species/${taxIdMap.get(speciesId).nickname}`}
                >
                  View Details
                </Link>
              </Card>
            )
          }
        </section>
        <h2>Other Species</h2>
        <section>
          {
            otherSpecies.map(({ speciesId, speciesName, totalGenomes }) =>
              <Card className="wgsa-species-card">
                <h3>{ speciesName }</h3>
                <CardMetadata icon="bug_report" title="genomes">
                  <Link to={`/genomes?speciesId=${speciesId}`} title="Browse genomes">
                    {totalGenomes} genomes
                  </Link>
              </CardMetadata>
              </Card>
            )
          }
        </section>
      </div>
    );
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(Index);
