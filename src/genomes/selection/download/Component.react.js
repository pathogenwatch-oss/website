import React from 'react';
import { connect } from 'react-redux';

import Spinner from '../../../components/Spinner.react';
import { FormattedName } from '../../../organisms';

import {
  getSelectionDownloads,
  getSelectedGenomeList,
  getDownloadSummary,
} from '../selectors';

import { fetchDownloads, toggleDropdown } from '../actions';

import { statuses } from '../../../app/constants';

import { getServerPath } from '../../../utils/Api';

const DownloadLink = ({ link, ids, children }) => (
    <form
      action={link}
      method="POST"
      target="_blank"
    >
      <button>{children}</button>
      <input type="hidden" name="ids" value={ids} />
    </form>
  );

const Section = ({ organismId, organismName, total, tasks, ids }) => (
  <li>
    <FormattedName fullName organismId={organismId} title={organismName} />
    <ul className="wgsa-genome-download-list">
      <li>
        <DownloadLink link={getServerPath('/download/genome/fasta')} ids={ids}>
          FASTA files
        </DownloadLink>
      </li>
      {tasks.map(task =>
        <li key={task.name}>
          <DownloadLink link={getServerPath(`/download/analysis/${task.name}`)} ids={task.ids}>
            {task.label}
            {task.sources.length > 0 && <small>&nbsp;({task.sources.join(', ')})</small>}
          </DownloadLink>
          <span>{task.ids.length}/{total}</span>
        </li>
      )}
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
          <header>
            Download
          </header>
          <div className="wgsa-genome-downloads__content">
            <ul>
              { this.showAllOrganisms(summary, ids) &&
                <li>
                  All Organisms
                  <ul className="wgsa-genome-download-list">
                    <li>
                      <DownloadLink link={getServerPath('/download/genome/fasta')} ids={ids}>
                        FASTA files
                      </DownloadLink>
                    </li>
                    <li>
                      <DownloadLink link={getServerPath('/download/analysis/speciator')} ids={ids}>
                        <strong>Speciation</strong>
                      </DownloadLink>
                    </li>
                  </ul>
                </li> }
              { summary.map(item => <Section key={item.organismId} {...item} />) }
            </ul>
          </div>
          <footer>
            <button
              className="mdl-button"
              onClick={() => this.props.toggle('selection')}
            >
              Go back
            </button>
          </footer>
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
    toggle: (view) => dispatch(toggleDropdown(view)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Download);
