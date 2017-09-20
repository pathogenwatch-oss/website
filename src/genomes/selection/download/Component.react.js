import React from 'react';
import { connect } from 'react-redux';

import Spinner from '../../../components/Spinner.react';
import { FormattedName } from '../../../organisms';

import { getSelectionDownloads, getSelectedGenomes } from '../selectors';

import { fetchDownloads } from '../actions';

import { statuses } from '../../../app/constants';
import { analysisLabels } from '../../constants';

const Section = ({ organismId, organismName, total, tasks }) => (
  <li>
    <FormattedName fullName organismId={organismId} title={organismName} />
    <ul>
      { Object.keys(tasks).map(task =>
        <li key={task}>
          <a href={`/download/analysis/${task}?organismId=${organismId}&ids=${tasks[task].join(',')}`}>
            <strong>{analysisLabels[task]}</strong> ({tasks[task].length}/{total})
          </a>
        </li>
      ) }
    </ul>
  </li>
);

const Download = React.createClass({

  componentDidMount() {
    this.props.fetch();
  },

  componentDidUpdate(previous) {
    if (previous.selection !== this.props.selection) {
      this.props.fetch();
    }
  },

  render() {
    const { download } = this.props;
    const { status, summary } = download;
    if (status === statuses.LOADING) {
      return <Spinner />;
    }
    if (status === statuses.ERROR) {
      return <p>Something went wrong. 😞</p>;
    }
    if (status === statuses.SUCCESS) {
      return (
        <ul>
          { Object.keys(summary).map(key =>
            <Section key={key} {...summary[key]} />
          ) }
        </ul>
      );
    }
    return null;
  },

});

function mapStateToProps(state) {
  return {
    download: getSelectionDownloads(state),
    selection: getSelectedGenomes(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetch: () => dispatch(fetchDownloads()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Download);
