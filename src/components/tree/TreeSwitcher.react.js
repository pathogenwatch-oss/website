import React from 'react';

export default React.createClass({

  displayName: 'TreeSwitcher',

  propTypes: {
    onChange: React.PropTypes.function,
  },

  getInitialState() {
    return {
      checked: false,
    };
  },

  render() {
    return (
      <label className="wgsa-tree-switcher" htmlFor="tree-switcher">
        <i className={`material-icons ${this.state.checked ? '' : 'active'}`} title="Population Tree">nature</i>
        <span className="mdl-switch mdl-js-switch mdl-js-ripple-effect">
          <input type="checkbox" id="tree-switcher" className="mdl-switch__input" onChange={this.handleChange} />
        </span>
        <i className={`material-icons ${this.state.checked ? 'active' : ''}`} title="Collection Tree">nature_people</i>
      </label>
    );
  },

  handleChange(event) {
    const { checked } = event.target;
    this.setState({ checked });
    this.props.onChange(checked);
  },

});
