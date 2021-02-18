import React from 'react';
import PropTypes from 'prop-types';

class Container extends React.Component {
  constructor() {
    super();
    this.state = {
      open: null,
      summary: null,
      search: null,
    };
  }

  render() {
    const open = this.state.open === null ? this.props.children.props.open : this.state.open;
    const summary = this.state.summary === null ? this.props.children.props.summary : this.state.summary;
    return React.cloneElement(this.props.children, {
      open,
      summary,
      toggle: () => this.setState({ open: !open }),
      clear: () => this.setState({ summary: false }),
      search:
        this.props.hasSearch ?
          { value: this.state.search,
            onChange: value => this.setState({ search: value }),
          } : undefined,
    });
  }
}

Container.propTypes = {
  children: PropTypes.element,
  hasSearch: PropTypes.bool,
};

export default Container;
