import React from 'react';
import PropTypes from 'prop-types';

class Container extends React.Component {
  constructor() {
    super();
    this.state = {
      visible: true,
    };
  }

  render() {
    return React.cloneElement(this.props.children, {
      visible: this.state.visible,
      onAccept: () => this.setState({ visible: false }),
    });
  }
}

Container.propTypes = {
  children: PropTypes.element,
};

export default Container;
