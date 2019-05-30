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
  useAuthToken();
  useAssemblerUsage(token);
  const [ session, error ] = useAssemblerSession(uploadedAt, token);

  return (
    <Loading
      complete={session || error}
      placeholder={
        <section className="pw-upload-page pw-centre-text">
          <Spinner />
        </section>
      }
    >
      { error ?
        <section key="error" className="pw-upload-page">
          <h1>Sorry, there's a problem.</h1>
          {typeof error.message === 'string' ?
            (<p>{error.message}</p>) :
            error.message }
        </section> :
        <Recovery key="loaded" session={session} />
      }
    </Loading>
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
