import React from 'react';
import { connect } from 'react-redux';

import Spinner from '~/components/Spinner.react';
import OrganismName from '~/organisms/OrganismName.react';
import Limiter from '../Limiter.react';
import DownloadLink from './DownloadLink.react';

import {
  getSelectionDownloads,
  getSelectedGenomeList,
  getDownloadSummary,
} from '../selectors';

import { fetchDownloads, toggleDropdown } from '../actions';

import { statuses } from '~/app/constants';

import { getServerPath } from '~/utils/Api';

const Section = ({ speciesId, speciesName, total, tasks, ids }) => {
  if (!speciesId) return null;
  return (
    <li>
      <OrganismName speciesName={speciesName} />
      <ul className="wgsa-genome-download-list">
        <li>
          <DownloadLink
            link={getServerPath('/download/genome/fasta')}
            ids={ids}
          >
            FASTA files
          </DownloadLink>
        </li>
        <li>
          <DownloadLink
            link={getServerPath('/download/genome/metadata')}
            ids={ids}
          >
            Metadata
          </DownloadLink>
        </li>
        {tasks.map(task => (
          <li key={task.name}>
            <DownloadLink
              link={task.link}
              ids={task.ids}
            >
              {task.label}
              {task.sources.length > 0 && (
                <small>&nbsp;({task.sources.join(', ')})</small>
              )}
            </DownloadLink>
            <span>
              {task.ids.length}/{total}
            </span>
          </li>
        ))}
      </ul>
    </li>
  );
};

const Content = React.createClass({
  componentDidMount() {
    this.props.fetch();
  },

  componentDidUpdate(previous) {
    const { selection, fetch } = this.props;
    if (previous.selection !== selection) {
      fetch();
    }
  },

  showAllOrganisms(summary, ids) {
    return (
      summary.length === 0 ||
      (summary.length === 1 && summary[0].ids.length !== ids.length) ||
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

    if (status === statuses.SUCCESS) {
      const ids = selection.map(_ => _.id);
      return (
        <ul>
          {this.showAllOrganisms(summary, ids) && (
            <li>
              All Organisms
              <ul className="wgsa-genome-download-list">
                <li>
                  <DownloadLink
                    link={getServerPath('/download/genome/fasta')}
                    ids={ids}
                  >
                    FASTA files
                  </DownloadLink>
                </li>
                <li>
                  <DownloadLink
                    link={getServerPath('/download/genome/metadata')}
                    ids={ids}
                  >
                    Metadata
                  </DownloadLink>
                </li>
                <li>
                  <DownloadLink
                    link={getServerPath('/download/analysis/speciator')}
                    ids={ids}
                  >
                    <strong>Species Prediction</strong>
                  </DownloadLink>
                </li>
              </ul>
            </li>
          )}
          {summary.map(item => (
            <Section key={item.speciesId} {...item} />
          ))}
        </ul>
      );
    }
    return null;
  },
});

const Download = ({ goBack, ...props }) => (
  <div className="wgsa-genome-downloads">
    <header className="wgsa-dropdown-header">Download</header>
    <div className="wgsa-genome-downloads__content">
      <Limiter type="maxDownloadSize">
        <Content {...props} />
      </Limiter>
    </div>
    <footer className="wgsa-dropdown-footer">
      <button className="mdl-button" onClick={goBack}>
        Go back
      </button>
    </footer>
  </div>
);

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
    goBack: () => dispatch(toggleDropdown('selection')),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Download);
