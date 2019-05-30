import './styles.css';

import React from 'react';
import { connect } from 'react-redux';

import AssemblerSessionRecovery from './AssemblerSessionRecovery.react';
import Recovery from './Recovery.react';

import { hasReads } from '../genomes/selectors';

import { isReadsEligible } from '../../file-utils';

const RecoveryPage = ({
  uploadedAt,
  sessionHasReads,
}) => {
  const readsEligible = isReadsEligible();

  if (readsEligible && sessionHasReads) {
    return (
      <AssemblerSessionRecovery
        uploadedAt={uploadedAt}
      />
    );
  }

  return <Recovery />;
};

function mapStateToProps(state) {
  return {
    sessionHasReads: hasReads(state),
  };
}

export default connect(
  mapStateToProps,
)(RecoveryPage);
