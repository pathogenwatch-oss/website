import React from 'react';

import classnames from 'classnames';

export default React.createClass({

  displayName: 'Dropdown',

  propTypes: {
    id: React.PropTypes.string,
    label: React.PropTypes.string,
    className: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    options: React.PropTypes.array,
    selected: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
    ]),
    floatingLabel: React.PropTypes.bool,
    fullWidth: React.PropTypes.bool,
    fixHeight: React.PropTypes.bool,
    onChange: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      className: '',
      placeholder: '',
      floatingLabel: false,
      fullWidth: false,
      fixHeight: false,
    };
  },

  componentDidUpdate(prevProps) {
    const { selected } = this.props;
    if (selected !== prevProps.selected) {
      this.upgradeElement();
    }
  },

  onChange(value) {
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  },

  upgradeElement() {
    const { textfield } = this.refs;
    if (textfield.attributes['data-upgraded']) {
      textfield.attributes.removeNamedItem('data-upgraded');
      componentHandler.upgradeElement(textfield);
    }
  },

  render() {
    const { id, label, floatingLabel, fullWidth, fixHeight } = this.props;
    const className = classnames(this.props.className,
      'mdl-textfield',
      'mdl-js-textfield',
      'getmdl-select', {
        'mdl-textfield--floating-label': floatingLabel,
        'getmdl-select__fullwidth': fullWidth,
        'getmdl-select__fix-height': fixHeight,
      });
    return (
      <div ref="textfield" className={className}>
        <input
          className="mdl-textfield__input"
          value={this.props.selected}
          type="text"
          id={id}
          readOnly
          tabIndex="-1"
          placeholder={this.props.placeholder}
        />
        { label ?
            <label className="mdl-textfield__label" htmlFor={id}>
              { label }
            </label> :
            null
        }
        <ul ref="list" htmlFor={id} className="mdl-menu mdl-menu--bottom-left mdl-js-menu">
          {this.props.options.map((item, index) =>
            <li key={index}
              className="mdl-menu__item"
              onClick={() => this.onChange(item)}
            >
              { item }
            </li>
          )}
        </ul>
      </div>
    );
  },

});

const materialMenuShow = MaterialMenu.prototype.show;
MaterialMenu.prototype.show = function(e) {
  const forRect = this.forElement_.parentElement.getBoundingClientRect();
  const remainingHeight = document.documentElement.clientHeight - forRect.bottom;
  const requiredHeight = Math.min(320, this.element_.offsetHeight);
  if (requiredHeight > remainingHeight) {
    this.container_.style.maxHeight = '320px';
    this.container_.style.marginTop = `-${requiredHeight - remainingHeight}px`;
  } else {
    this.container_.style.maxHeight = `${remainingHeight}px`;
    this.container_.style.marginTop = '';
  }
  this.container_.style.overflowY = 'auto';
  materialMenuShow.call(this, e);
};
