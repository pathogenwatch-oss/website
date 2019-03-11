import './styles.css';

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Spinner from '../../components/Spinner.react';
import Summary from '../Summary.react';
import Grid from '../../grid';
import DocumentTitle from '../../branding/DocumentTitle.react';

import { fetchUploads } from './actions';

import { formatDateTime } from '../../utils/Date';

const ListItem = ({ item }) => {
  const { uploadedAt, total, complete } = item;
  return (
    <Link
      className="wgsa-genome-list-item wgsa-genome-list-item--selectable"
      to={`/upload/${uploadedAt}`}
    >
      <span>{formatDateTime(uploadedAt)}</span>
      <span>{total}</span>
      <span>
        {total === complete ? (
          <span className="pw-upload-session-status uploaded">Uploaded</span>
        ) : (
          <span className="pw-upload-session-status incomplete">
            Incomplete
          </span>
        )}
      </span>
    </Link>
  );
};

const Header = () => (
  <header className="wgsa-genome-list-item wgsa-genome-list-header">
    <h3 className="wgsa-list-header-cell">Date Uploaded</h3>
    <h3 className="wgsa-list-header-cell">Genomes</h3>
    <h3 className="wgsa-list-header-cell">Status</h3>
  </header>
);

class Previous extends React.Component {
  componentDidMount() {
    this.props.fetch();
  }

  render() {
    const { loading, error, uploads } = this.props;
    return (
      <div className="wgsa-hipster-style wgsa-previous-uploads">
        <DocumentTitle>Previous Uploads</DocumentTitle>
        <Summary previous />
        {!!uploads.length ? (
          <Grid
            className="wgsa-genome-list-view"
            template={ListItem}
            items={uploads}
            columnCount={1}
            rowHeight={40}
            header={<Header />}
            headerHeight={25}
          />
        ) : (
          <div className="wgsa-content-margin">
            {loading && (
              <div className="pw-flex-center">
                <Spinner />
              </div>
            )}
            {error && <p>Failed to fetch previous uploads.</p>}
            {!loading && !error && uploads.length === 0 && (
              <p>No previous uploads found.</p>
            )}
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return state.upload.previous;
}

function mapDispatchToProps(dispatch) {
  return {
    fetch: () => dispatch(fetchUploads()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Previous);
