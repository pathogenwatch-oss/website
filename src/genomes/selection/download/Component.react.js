import React from 'react';
import { connect } from 'react-redux';

import Spinner from '../../../components/Spinner.react';
import { FormattedName } from '../../../organisms';

import {
  getSelectionDownloads,
  getSelectedGenomeList,
  getDownloadSummary,
} from '../selectors';

import { fetchDownloads } from '../actions';

import { statuses } from '../../../app/constants';

import { getServerPath } from '../../../utils/Api';

const Section = ({ organismId, organismName, total, tasks, ids }) => (
  <li>
    <FormattedName fullName organismId={organismId} title={organismName} />
    <ul className="wgsa-genome-download-list">
      <li>
        <a href={getServerPath(`/download/archive/genome?ids=${ids}`)}>
          <strong>FASTA files</strong>
        </a>
      </li>
      { tasks.map(task =>
        <li key={task.name}>
          <a href={getServerPath(`/download/analysis/${task.name}?ids=${task.ids.join(',')}`)}>
            <strong>{task.label}</strong>
            {task.sources.length > 0 && <small>&nbsp;({task.sources.join(', ')})</small>}
          </a>
          <span>{task.ids.length}/{total}</span>
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

  showAllOrganisms(summary, ids) {
    return (
      summary.length === 0 ||
      summary.length === 1 && summary[0].ids.length !== ids.length ||
      summary.length > 1
    );
  },

  render() {
    const { status, summary, selection } = this.props;
    if (status === statuses.LOADING) {
      return <Spinner />;
    }
    if (status === statuses.ERROR) {
      return <p>Something went wrong. 😞</p>;
    }
    const ids = selection.map(_ => _.id);
    if (status === statuses.SUCCESS) {
      return (
        <div className="wgsa-genome-downloads">
          <ul>
            { this.showAllOrganisms(summary, ids) &&
              <li>
                All Organisms
                <ul className="wgsa-genome-download-list">
                  <li>
                    <a href={getServerPath(`/download/archive/genome?ids=${ids}`)}>
                      <strong>FASTA files</strong>
                    </a>
                  </li>
                </ul>
              </li> }
            { summary.map(item => <Section key={item.organismId} {...item} />) }
          </ul>
        </div>
      );
    }
    return null;
  },

});

function mapStateToProps(state) {
  return {
    status: getSelectionDownloads(state).status,
    summary: getDownloadSummary(state),
    selection: getSelectedGenomeList(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetch: () => dispatch(fetchDownloads()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Download);
