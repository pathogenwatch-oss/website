import './styles.css';

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import DocumentTitle from '~/branding/DocumentTitle.react';
import Grid from '~/grid';
import Loading from '~/components/Loading.react';
import Spinner from '~/components/Spinner.react';
import Summary from '../Summary.react';

import { fetchUploads } from './actions';

import { formatDateTime } from '~/utils/Date';

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

function getContent({ loading, error, uploads }) {
  if (error) {
    return <p>Failed to fetch previous uploads.</p>;
  } else if (!loading && uploads.length === 0) {
    return <p>No previous uploads found.</p>;
  }
  return (
    <Grid
      className="wgsa-genome-list-view wgsa-previous-uploads"
      template={ListItem}
      items={uploads}
      columnCount={1}
      rowHeight={40}
      header={<Header />}
      headerHeight={25}
    />
  );
}

const Previous = (props) => {
  React.useEffect(() => {
    props.fetch();
  }, []);
  return (
    <React.Fragment>
      <DocumentTitle>Previous Uploads</DocumentTitle>
      <Summary />
      <Loading
        complete={props.uploads.length > 0 || props.error}
        placeholder={
          <div className="pw-flex-center">
            <Spinner />
          </div>
        }
      >
        {getContent(props)}
      </Loading>
    </React.Fragment>
  );
};

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
