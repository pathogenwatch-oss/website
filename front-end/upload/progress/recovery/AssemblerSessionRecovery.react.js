import './styles.css';

import React from 'react';
import { connect } from 'react-redux';

import Recovery from './Recovery.react';
import Spinner from '~/components/Spinner.react';
import Loading from '~/components/Loading.react';

import { useAssemblerSession } from '../assembly/hooks';
import { useAuthToken } from '~/auth/hooks';
import { useAssemblerUsage } from '../../hooks';

const AssemblySessionRecovery = ({
  uploadedAt,
  token,
}) => {
  // FIXME

  return null;
};

function mapStateToProps(state) {
  return {
    token: state.auth.token,
  };
}

export default connect(
  mapStateToProps,
)(AssemblySessionRecovery);
