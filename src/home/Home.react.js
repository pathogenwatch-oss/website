import './styles.css';

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { FormattedSpeciesName } from '../species';
import Card, { CardMetadata } from '../card';

import { getWgsaSpecies, getOtherSpecies } from './selectors';

import { fetchSummary } from './actions';

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

const Home = React.createClass({

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
            wgsaSpecies.map(({ speciesId, totalCollections, totalGenomes, deployed }) =>
              <Card className="wgsa-species-card">
                <h3>
                  <FormattedSpeciesName speciesId={speciesId} />
                  { deployed && <span title="Deployed">&nbsp;👍</span>}
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);
