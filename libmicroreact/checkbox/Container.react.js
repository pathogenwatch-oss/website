import React from 'react';
import PropTypes from 'prop-types';

class Container extends React.Component {
  constructor() {
    super();
    this.state = {
      checked: null,
    };
  }

  componentDidUpdate() {
    console.log(this.state);
  }

  render() {
    const checked = this.state.checked === null ? !!this.props.children.props.checked : this.state.checked;
    return React.cloneElement(this.props.children, {
      checked,
      onChange: () => this.setState({ checked: !checked }),
    });
  }
}

Container.propTypes = {
  children: PropTypes.element,
};

export default Container;
