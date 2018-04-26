import React from 'react';
import { connect } from 'react-redux';

import Fade from '../../components/fade';

import { getAccessStatus } from './selectors';

const AccessStatus = ({ status }) => {
  if (!status || status === 'LOADING') return null;

  let content;

  if (status === 'ERROR') {
    content = <p>❎ Failed, please try again</p>;
  }

  if (status === 'OK') {
    content = <p>✔️ Saved</p>;
  }

  return (
    <Fade className="wgsa-collection-access-status">{content}</Fade>
  );
};

function mapStateToProps(state) {
  return {
    status: getAccessStatus(state),
  };
}

export default connect(mapStateToProps)(AccessStatus);
