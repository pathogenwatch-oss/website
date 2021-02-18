import React from 'react';
import PropTypes from 'prop-types';

class Container extends React.Component {
  constructor() {
    super();
    this.state = {
      lassoActive: false,
      lassoPath: null,
    };
  }

  render() {
    const { children } = this.props;
    return React.cloneElement(this.props.children, {
      lassoActive: this.state.lassoActive,
      lassoPath: this.state.lassoPath,
      onLassoActiveChange: () => this.setState({ lassoActive: !this.state.lassoActive }),
      onLassoPathChange: (lassoPath) => {
        children.props.onLassoPathChange(lassoPath);
        this.setState({ lassoPath });
      },
    });
  }
}

Container.propTypes = {
  children: PropTypes.element,
};

export default Container;
