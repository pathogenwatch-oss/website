import React from 'react';
import { connect } from 'react-redux';

import { names } from './constants';

function updateDocumentTitle(appName, newTitle) {
  document.title = `${appName} | ${newTitle}`;
}

class DocumentTitle extends React.Component {

  componentWillMount() {
    updateDocumentTitle(names[this.props.brandingId], this.props.title);
  }

  componentDidUpdate() {
    updateDocumentTitle(names[this.props.brandingId], this.props.title);
  }

  render() {
    return null;
  }

}

function mapStateToProps(state) {
  return {
    brandingId: state.branding.id,
  };
}

export default connect(mapStateToProps)(DocumentTitle);
