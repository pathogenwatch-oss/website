import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import Container from '../component';

import { isUploading } from '../selectors';

const Upload = withRouter(React.createClass({

  propTypes: {
    isUploading: React.PropTypes.bool,
  },

  componentDidUpdate(previous) {
    const { uploading, router } = this.props;
    if (!previous.uploading && uploading) {
      router.push('/genomes?owner=me');
    }
  },

  render() {
    return (
      <Container>
        <p className="wgsa-filterable-content wgsa-hub-big-message">
          Drag and drop files to begin.
        </p>
      </Container>
    );
  },

}));

function mapStateToProps(state) {
  return {
    uploading: isUploading(state),
  };
}

export default connect(mapStateToProps)(Upload);
