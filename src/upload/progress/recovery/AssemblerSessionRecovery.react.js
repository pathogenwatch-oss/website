import './styles.css';

import React from 'react';
import { connect } from 'react-redux';

import Recovery from './Recovery.react';

import { useAssemblerSession } from '../assembly/hooks';
import { useAuthToken } from '~/auth/hooks';
import { useAssemblerUsage } from '../../hooks';

const AssemblySessionRecovery = ({
  uploadedAt,
  token,
}) => {
  useAuthToken();
  useAssemblerUsage(token);
  const [ session, error ] = useAssemblerSession(uploadedAt, token);

  if (error) {
    return (
      <section className="pw-upload-page">
        <h1>Sorry, there's a problem.</h1>
        <p>{error.message}</p>
      </section>
    );
  }

  return (
    <Recovery session={session} />
  );
};

function mapStateToProps(state) {
  return {
    token: state.auth.token,
  };
}

export default connect(
  mapStateToProps,
)(AssemblySessionRecovery);
