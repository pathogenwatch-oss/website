import { connect } from 'react-redux';

import PrivateMetadata from './PrivateMetadata.react';

import { addPrivateMetadata } from './actions';

function mapDispatchToProps(dispatch) {
  return {
    addMetadata: data => dispatch(addPrivateMetadata(data)),
  };
}

export default connect(null, mapDispatchToProps)(PrivateMetadata);
