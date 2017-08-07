import './styles.css';

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { FormattedName, taxIdMap } from '../index';
import { CardMetadata } from '../../card';
import StaticGrid from '../../components/static-grid';
import Spinner from '../../components/Spinner.react';

import { getWgsaOrganisms, getOtherOrganisms } from '../selectors';

import { fetchSummary } from '../actions';

function mapStateToProps(state) {
  return {
    loading: state.organisms.loading,
    wgsaOrganisms: getWgsaOrganisms(state),
    otherOrganisms: getOtherOrganisms(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetch: () => dispatch(fetchSummary()),
  };
}

const WGSAOrganism =
  ({ item: { organismId, totalCollections, totalGenomes } }) => (
    <Link
      key={organismId}
      className="wgsa-organism-card wgsa-card wgsa-card--bordered"
      to={`/organisms/${taxIdMap.get(organismId).nickname}`}
      title="Organism Home"
    >
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
    </Link>
  );

const OtherOrganism =
  ({ item: { organismId, organismName, totalGenomes } }) => (
    <div key={organismId} className="wgsa-organism-card wgsa-card wgsa-card--bordered">
      <h3 className="wgsa-section-title">
        {organismName}
      </h3>
      <CardMetadata icon="insert_drive_file" title="Genomes">
        <Link to={`/genomes?organismId=${organismId}`} title="Browse Genomes">
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
    const { loading, wgsaOrganisms, otherOrganisms } = this.props;
    return (
      <div className="wgsa-page">
        <h1>Organisms</h1>
        { loading && <Spinner />}
        { !!otherOrganisms.length && <h2>WGSA Organisms</h2> }
        <StaticGrid
          density="compact"
          items={wgsaOrganisms}
          template={WGSAOrganism}
          keyProp="organismId"
        />
        { !!otherOrganisms.length && <h2>Other Organisms</h2> }
        <StaticGrid
          density="compact"
          items={otherOrganisms}
          template={OtherOrganism}
          keyProp="organismId"
        />
      </div>
    );
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(Index);
