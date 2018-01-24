import React from 'react';
import { connect } from 'react-redux';

import config from '../../app/config';
import { getSelectionSize } from './selectors';

import Sorry from './Sorry.react';

const Limiter = ({ type, amount, children }) => {
  const limits = config[type] || {};
  const { anonymous = 150, loggedIn = 500 } = limits;
  const limit = config.user ? loggedIn : anonymous;

  if (amount > limit) {
    return (
      <Sorry type={type} amount={amount} limit={limit} loggedIn={loggedIn} />
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
