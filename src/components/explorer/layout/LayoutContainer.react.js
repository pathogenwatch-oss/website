import React from 'react';
import { connect } from 'react-redux';

import { listen, clicked } from '^/actions/bodyClick';

export default connect()(React.createClass({

  displayName: 'LayoutContainer',

  propTypes: {
    downloadMenuButtonClick: React.PropTypes.func,
    children: React.PropTypes.arrayOf(React.PropTypes.element),
    dispatch: React.PropTypes.func,
  },

  componentWillMount() {
    document.title = 'WGSA | Explore Collection';

    this.props.dispatch(
      listen(() => this.props.dispatch(clicked()))
    );
  },

  componentWillUnmount() {
    this.props.dispatch(listen(null));
  },

  render() {
    return (
      <span>{this.props.children}</span>
    );
  },

}));
