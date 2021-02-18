import React from 'react';
import PropTypes from 'prop-types';

class Container extends React.Component {
  constructor() {
    super();
    this.state = {
      phylocanvasState: {},
    };
  }

  componentDidUpdate() {
    console.log(this.state);
  }

  render() {
    // return this.props.children;
    const props = {
      phylocanvasState: {
        ...(this.props.children.props.phylocanvasState || {}),
        ...this.state.phylocanvasState,
      },
      onPhylocanvasStateChange: (phylocanvasState) =>
        this.setState({
          phylocanvasState: {
            ...this.state.phylocanvasState,
            ...phylocanvasState,
          },
        }),
    };
    return React.cloneElement(this.props.children, props);
  }
}

Container.propTypes = {
  children: PropTypes.element,
};

export default Container;
