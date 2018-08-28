import React from 'react';
import { connect } from 'react-redux';

import { names } from './constants';

class DocumentTitle extends React.Component {

  componentWillMount() {
    this.updateTitle();
  }

  componentDidUpdate() {
    this.updateTitle();
  }

  updateTitle() {
    const title = this.props.children || this.props.title;
    const appName = names[this.props.brandingId];
    document.title = `${appName} | ${title}`;
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
