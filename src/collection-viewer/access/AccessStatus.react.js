import React from 'react';
import { connect } from 'react-redux';

import Fade from '~/components/fade';

import { getAccessStatus } from './selectors';

const AccessStatus = ({ status }) => {
  if (!status || status === 'LOADING') return null;

  let content;

  if (status === 'ERROR') {
    content = <p><i className="material-icons">error_outline</i> Failed, please try again</p>;
  }

  if (status !== 'OK') {
    content = <p><i className="material-icons">check_circle</i> Saved</p>;
  }

  return (
    <Fade className="wgsa-collection-access-status">
      {content}
    </Fade>
  );
};

function mapStateToProps(state) {
  return {
    status: getAccessStatus(state),
  };
}

export default connect(mapStateToProps)(AccessStatus);
