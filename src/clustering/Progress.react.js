import React from 'react';
import { connect } from 'react-redux';

import Notify from '../components/Notify.react';
import Poll from '../components/Poller.react';
import CircularProgress from '../components/CircularProgress.react';

import { getSelectedGenomeId, getProgress, getTaskId } from './selectors';
import { updateProgress } from './actions';

import { fetchJson } from '../utils/Api';

class QueuePosition extends React.Component {
  constructor() {
    super();
    this.state = {
      position: null,
      date: null,
    };
  }

  getQueuePosition = () => {
    fetchJson('GET', `/api/genome/${this.props.genomeId}/clusters/position`, { date: this.state.date })
      .then(({ position, date }) => this.setState({ position, date }))
      .catch(console.error);
  }

  renderQueuePosition = () => {
    const { position } = this.state;
    if (position === null) {
      return 'Awaiting Queue Position';
    }
    if (position === 0) {
      return 'Awaiting Progress';
    }
    return `Queue Position: ${position}`;
  }

  render() {
    return (
      <Notify room={this.props.taskId} topic="clustering" onMessage={this.props.updateProgress}>
        <div className="pw-cluster-content pw-cluster-progress">
          { this.props.progress > 0 ?
            <React.Fragment>
              <CircularProgress
                percentage={this.props.progress}
                radius="64"
                strokeWidth="12"
                decimalPlaces={1}
              />
              <p className="wgsa-blink"><strong>Running</strong></p>
            </React.Fragment> :
            <Poll interval={10} fn={this.getQueuePosition}>
              <strong>Job Queued</strong>
              <p className="wgsa-blink">
                { this.renderQueuePosition() }
              </p>
            </Poll> }
        </div>
      </Notify>
    );
  }
}

function mapStateToProps(state) {
  return {
    genomeId: getSelectedGenomeId(state),
    progress: getProgress(state),
    taskId: getTaskId(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateProgress: (payload) => dispatch(updateProgress(payload)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(QueuePosition);
