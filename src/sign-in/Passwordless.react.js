import React from 'react';
import { connect } from 'react-redux';
import Passwordless from 'cgps-user-accounts/components/passwordless';

import Spinner from '../components/Spinner.react';

import { showToast } from '../toast';
import { sendSignInToken } from './api';

function mapDispatchToProps(dispatch) {
  return {
    showMessage: message => dispatch(showToast({ message })),
  };
}

export default connect(mapDispatchToProps)(
  ({ showMessage }) =>
    <Passwordless
      getPasswordlessToken={sendSignInToken}
      showMessage={showMessage}
      spinner={<Spinner />}
    />
);
