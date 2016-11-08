import React from 'react';
import { connect } from 'react-redux';

import Layout from './layout/Layout.react';

const CollectionViewer = React.createClass({

  getDefaultProps() {
    return {
      title: 'Explore Collection',
    };
  },

  componentDidMount() {
    document.title = `WGSA | ${this.props.title}`;
  },

  render() {
    return (
      <Layout />
    );
  },

});

function mapStateToProps({ collection }) {
  const { metadata = {} } = collection;
  return {
    title: metadata.title,
  };
}

export default connect(mapStateToProps)(CollectionViewer);
