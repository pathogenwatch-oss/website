import React from 'react';
import PropTypes from 'prop-types';

class Container extends React.Component {
  constructor() {
    super();
    this.state = {
      open: null,
    };
  }

  render() {
    const open = this.state.open === null ? this.props.children.props.open : this.state.open;
    return React.cloneElement(this.props.children, {
      open,
      toggle: () => this.setState({ open: !open }),
    });
  }
}

Container.propTypes = {
  children: PropTypes.element,
};

export default Container;
