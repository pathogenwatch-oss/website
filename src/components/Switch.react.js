import '../css/switch.css';

import React from 'react';

export default React.createClass({

  displayName: 'Switch',

  propTypes: {
    id: React.PropTypes.string,
    left: React.PropTypes.object,
    right: React.PropTypes.object,
    onChange: React.PropTypes.func,
  },

  getInitialState() {
    return {
      checked: false,
    };
  },

  render() {
    const { left, right } = this.props;
    return (
      <label className="wgsa-switch" htmlFor={this.props.id}>
        <i className={`material-icons ${this.state.checked ? '' : 'active'}`} title={left.title}>{left.icon}</i>
        <span className="mdl-switch mdl-js-switch mdl-js-ripple-effect">
          <input type="checkbox" id={this.props.id} className="mdl-switch__input" onChange={this.handleChange} />
        </span>
        <i className={`material-icons ${this.state.checked ? 'active' : ''}`} title={right.title}>{right.icon}</i>
      </label>
    );
  },

  handleChange(event) {
    const { checked } = event.target;
    this.setState({ checked });
    this.props.onChange(checked);
  },

});
