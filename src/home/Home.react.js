import './styles.css';

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { FormattedSpeciesName } from '../species';
import Card, { CardMetadata } from '../card';

import { getWgsaSpecies, getOtherSpecies } from './selectors';

function mapStateToProps(state) {
  return {
    wgsaSpecies: getWgsaSpecies(state),
    otherSpecies: getOtherSpecies(state),
  };
}

export default connect(mapStateToProps)(
  ({ wgsaSpecies, otherSpecies }) => (
    <div className="wgsa-home-page">
      <h2>WGSA Species</h2>
      <section>
        {
          wgsaSpecies.map(({ speciesId, collections, genomes, deployed }) =>
            <Card className="wgsa-species-card">
              <h3>
                <FormattedSpeciesName speciesId={speciesId} />
                { deployed && <span title="Deployed">👍</span>}
              </h3>
              <CardMetadata icon="collections" title="collections">
                <Link to={`/collections?speciesId=${speciesId}`} title="Browse collections">
                  {collections} collections
                </Link>
              </CardMetadata>
              <CardMetadata icon="bug_report" title="genomes">
                <Link to={`/genomes?speciesId=${speciesId}`} title="Browse genomes">
                  {genomes} genomes
                </Link>
            </CardMetadata>
            </Card>
          )
        }
      </section>
      <h2>Other Species</h2>
      <section>
        {
          otherSpecies.map(({ speciesId, speciesName, collections, genomes }) =>
            <Card className="wgsa-species-card">
              <h3>{ speciesName }</h3>
              <CardMetadata icon="bug_report" title="genomes">
                <Link to={`/genomes?speciesId=${speciesId}`} title="Browse genomes">
                  {genomes} genomes
                </Link>
            </CardMetadata>
            </Card>
          )
        }
      </section>
    </div>
  )
);
