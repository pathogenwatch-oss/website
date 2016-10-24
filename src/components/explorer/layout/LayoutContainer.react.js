import React from 'react';
import { connect } from 'react-redux';

import { listen, clicked } from '^/actions/bodyClick';

import Species from '^/species';

function mapStateToProps({ collection }) {
  return { ...collection.metadata };
}

export default connect(mapStateToProps)(React.createClass({

  displayName: 'LayoutContainer',

  propTypes: {
    downloadMenuButtonClick: React.PropTypes.func,
    children: React.PropTypes.arrayOf(React.PropTypes.element),
    dispatch: React.PropTypes.func,
  },

  componentWillMount() {
    document.title = [
      'WGSA',
      '|',
      `${this.props.title || 'Explore Collection'}`,
      `[${Species.current.name}]`,
    ].join(' ');

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
