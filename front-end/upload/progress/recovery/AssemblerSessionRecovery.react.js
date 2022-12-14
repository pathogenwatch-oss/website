import './styles.css';

import React from 'react';
import { connect } from 'react-redux';

import Recovery from './Recovery.react';
import Spinner from '~/components/Spinner.react';
import Loading from '~/components/Loading.react';

import { useAssemblerSession } from '../assembly/hooks';

const AssemblySessionRecovery = ({
  uploadedAt,
}) => {
  const [ session, error ] = useAssemblerSession(uploadedAt);

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

export default AssemblySessionRecovery;
