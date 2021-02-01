import React from 'react';
import { connect } from 'react-redux';

import config from '../../app/config';
import { getSelectionSize } from './selectors';

import Sorry from './Sorry.react';

const Limiter = ({ type, amount, children }) => {
  const limit = config[type] || 1000;

  if (amount > limit) {
    return (
      <Sorry type={type} amount={amount} limit={limit} />
    );
  }

  return children;
};

function mapStateToProps(state) {
  return {
    amount: getSelectionSize(state),
  };
}

export default connect(mapStateToProps)(Limiter);
