// import 'getmdl-select/getmdl-select.min.css';
// import 'getmdl-select/getmdl-select.min.js';

import React from 'react';

export default React.createClass({

  displayName: 'Dropdown',

  propTypes: {
    id: React.PropTypes.string,
    label: React.PropTypes.string,
    className: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    options: React.PropTypes.array,
    selected: React.PropTypes.string,
    onChange: React.PropTypes.func,
  },

  componentDidUpdate() {
    componentHandler.upgradeDom();
  },

  onChange(value) {
    console.log('change');
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  },

  render() {
    const { id, label } = this.props;
    const className = `mdl-textfield mdl-js-textfield getmdl-select getmdl-select__fullwidth getmdl-select__fix-height ${this.props.className}`
    return (
      <div className={className}>
        <input
          className="mdl-textfield__input"
          value={this.props.selected}
          type="text"
          id={id}
          readOnly
          tabIndex="-1"
          placeholder={placeholder}
        />
        { label ? <label className="mdl-textfield__label" htmlFor={id}>{ label }</label> : null }
        <ul
          className="mdl-menu mdl-menu--bottom-left mdl-js-menu"
          htmlFor={id}
        >
          {this.props.options.map((item, index) =>
            <li key={index} className="mdl-menu__item" onClick={() => this.onChange(item)}>{ item }</li>
          )}
        </ul>
      </div>
    );
  },

});
