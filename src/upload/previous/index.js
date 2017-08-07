import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Spinner from '../../components/Spinner.react';
import Summary from '../Summary.react';
import Grid from '../../grid';

import { fetchUploads } from './actions';

const ListItem = ({ item }) => {
  const { uploadedAt, total } = item;
  return (
    <Link className="wgsa-genome-list-item wgsa-genome-list-item--selectable wgsa-card--bordered" to={`/upload/${uploadedAt}`}>
      <span>{new Date(uploadedAt).toLocaleString()}</span>
      <span>{total}</span>
    </Link>
  );
};

const Header = () => (
  <div className="wgsa-genome-list-item wgsa-genome-list-header wgsa-content-margin-right">
    <h3 className="wgsa-list-header-cell">Date Uploaded</h3>
    <h3 className="wgsa-list-header-cell">Files</h3>
  </div>
);

const Previous = React.createClass({

  componentWillMount() {
    this.props.fetch();
    document.title = 'WGSA | Previous Uploads';
  },

  render() {
    const { loading, error, uploads } = this.props;
    return (
      <div className="wgsa-hipster-style wgsa-filterable-view">
        <Summary previous />
        { !!uploads.length ?
          <Grid
            className="wgsa-genome-list-view"
            template={ListItem}
            items={uploads}
            columnCount={1}
            rowHeight={40}
            rightMargin={48}
            header={<Header />}
            headerHeight={25}
          /> :
          <div className="wgsa-content-margin">
            { loading && <Spinner /> }
            { error && <p>Failed to fetch previous uploads 😞</p> }
            { uploads.length === 0 && <p>No previous uploads found.</p> }
          </div> }
      </div>
    );
  },

});

function mapStateToProps(state) {
  return state.upload.previous;
}

function mapDispatchToProps(dispatch) {
  return {
    fetch: () => dispatch(fetchUploads()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Previous);
