import React from 'react';
import { connect } from 'react-redux';

import config from '../../app/config';
import { getSelectionSize } from './selectors';

import Sorry from './Sorry.react';
import { getCollectionSummaryOrganismId } from '~/genomes/create-collection-form/selectors';

const TaxonLimiter = ({ type, organismId, amount, children }) => {
  const limit = config[type][organismId] || config[type].default || 2000;

  if (amount > limit) {
    return (
      <Sorry type={'maxCollectionSize'} amount={amount} limit={limit} feature={'collections of this organism'} />
    );
  }

  return children;
};

function mapStateToProps(state) {
  return {
    amount: getSelectionSize(state),
    organismId: getCollectionSummaryOrganismId(state),
  };
}

export default connect(mapStateToProps)(TaxonLimiter);
