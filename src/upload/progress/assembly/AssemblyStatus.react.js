import { connect } from 'react-redux';

import { useAssemblyStatus } from './hooks';

import { isAssemblyComplete, isAssemblyInProgress } from './selectors';
import { hasReads } from '../files/selectors';

export default connect(state => ({
  assemblyComplete: isAssemblyComplete(state),
  assemblyInProgress: isAssemblyInProgress(state),
  hasReads: hasReads(state),
  token: state.auth.token,
}))(props => {
  useAssemblyStatus(props);
  return null;
});
