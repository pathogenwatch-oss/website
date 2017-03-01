import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { taxIdMap } from '../index';

const sectionStyle = {
  width: '80%',
  margin: '32px auto',
};

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
    const { nickname, formattedName, definitionText, desc } = taxIdMap.get(speciesId);
    return (
      <div className="wgsa-hipster-style wgsa-filterable-view">
        <div className="wgsa-species-details">
          <h1>{formattedName}</h1>
          <img src={`/images/${nickname}.jpg`} />
          <h4>{definitionText}</h4>
          <p>{desc}</p>
        </div>
        <div className="wgsa-hub-stats-group" style={sectionStyle}>
          <Link className="wgsa-hub-stats-section" to="account/collections">
            <h3 className="wgsa-hub-stats-heading">Collections</h3>
            <p className="wgsa-hub-stats-value wgsa-hub-stats-value--large">{totalCollections}</p>
          </Link>
          <Link className="wgsa-hub-stats-section" to="account/genomes">
            <h3 className="wgsa-hub-stats-heading">Genomes</h3>
            <p className="wgsa-hub-stats-value wgsa-hub-stats-value--large">{totalGenomes}</p>
          </Link>
        </div>
      </div>
    );
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(Details);
