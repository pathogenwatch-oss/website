import './styles.css';

import React from 'react';
import { connect } from 'react-redux';

import Recovery from './Recovery.react';
import Spinner from '~/components/Spinner.react';
import Fade from '~/components/fade';

import { useAssemblerSession } from '../assembly/hooks';
import { useAuthToken } from '~/auth/hooks';
import { useAssemblerUsage } from '../../hooks';

function useWait(time) {
  const [ waited, setWaited ] = React.useState(false);
  React.useEffect(() => {
    setTimeout(() => setWaited(true), time);
  }, []);
  return waited;
}

const AssemblySessionRecovery = ({
  uploadedAt,
  token,
}) => {
  useAuthToken();
  useAssemblerUsage(token);
  const [ session, error ] = useAssemblerSession(uploadedAt, token);
  const waited = useWait(500);

  let content;
  if (waited && error) {
    content = (
      <section key="error" className="pw-upload-page">
        <h1>Sorry, there's a problem.</h1>
        {typeof error.message === 'string' ?
          (<p>{error.message}</p>) :
          error.message }
      </section>
    );
  } else if (waited && session) {
    content = <Recovery key="loaded" session={session} />;
  } else {
    content = (
      <section key="loading" className="pw-upload-page pw-centre-text">
        <Spinner />
      </section>
    );
  }


  return (
    <Fade>
      {content}
    </Fade>
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
