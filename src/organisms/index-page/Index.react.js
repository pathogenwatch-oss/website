import './styles.css';

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { FormattedName, taxIdMap } from '../index';
import { CardMetadata } from '../../card';
import StaticGrid from '../../components/static-grid';
import Spinner from '../../components/Spinner.react';
import DocumentTitle from '../../branding/DocumentTitle.react';

import { getSupportedOrganisms, getAllSpecies } from '../selectors';

import { fetchSummary } from '../actions';

function mapStateToProps(state) {
  return {
    loading: state.organisms.loading,
    supportedOrganisms: getSupportedOrganisms(state),
    allSpecies: getAllSpecies(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetch: () => dispatch(fetchSummary()),
  };
}

const SupportedOrganism =
  ({ item: { organismId, totalCollections, totalGenomes, organism = taxIdMap.get(organismId) } }) => (
    <Link
      key={organismId}
      className="wgsa-organism-card wgsa-card wgsa-card--bordered"
      to={`/organisms/${organism.nickname}`}
      title={`${organism.name} Homepage`}
    >
      <h3 className="wgsa-section-title">
        <FormattedName organismId={organismId} fullName />
      </h3>
      <CardMetadata icon="wgsa_genome">
        <Link to={`/genomes?organismId=${organismId}`} title="Browse Genomes">
          {totalGenomes} Genome{totalGenomes === 1 ? '' : 's'}
        </Link>
      </CardMetadata>
      <CardMetadata icon="collections">
        <Link to={`/collections?organismId=${organismId}`} title="Browse Collections">
          {totalCollections} Collection{totalCollections === 1 ? '' : 's'}
        </Link>
      </CardMetadata>
    </Link>
  );

const Species =
  ({ item: { speciesId, speciesName, totalGenomes } }) => (
    <div key={speciesId} className="wgsa-organism-card wgsa-card wgsa-card--bordered">
      <h3 className="wgsa-section-title"><em>{speciesName}</em></h3>
      <CardMetadata icon="wgsa_genome">
        <Link to={`/genomes?speciesId=${speciesId}`} title="Browse Genomes">
          {totalGenomes} Genome{totalGenomes === 1 ? '' : 's'}
        </Link>
      </CardMetadata>
    </div>
  );

const Index = React.createClass({

  componentDidMount() {
    this.props.fetch();
  },

  render() {
    const { loading, supportedOrganisms, allSpecies } = this.props;
    return (
      <div className="wgsa-page">
        <DocumentTitle>Organisms</DocumentTitle>
        <h1>Organisms</h1>
        { loading && <Spinner />}
        { !!supportedOrganisms.length && <h2>Supported Organisms</h2> }
        <StaticGrid
          density="compact"
          items={supportedOrganisms}
          template={SupportedOrganism}
          keyProp="organismId"
        />
        { !!allSpecies.length && <h2>All Species</h2> }
        <StaticGrid
          density="compact"
          items={allSpecies}
          template={Species}
          keyProp="organismId"
        />
      </div>
    );
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(Index);
