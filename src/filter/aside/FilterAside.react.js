import './styles.css';

import React from 'react';
import classnames from 'classnames';
import debounce from 'lodash/debounce';

class FilterAside extends React.Component {

  constructor(props) {
    super(props);
    this.textOnChangeEffect = debounce(props.textOnChangeEffect, 250);
  }

  onChange = (value) => {
    this.props.textOnChange(value);
    this.textOnChangeEffect(value);
  };

  render() {
    const {
      active,
      children,
      clear,
      loading,
      prefilter,
      textValue,
    } = this.props;

    return (
      <aside className={classnames('wgsa-filter', { 'wgsa-filter--active': active })}>
        <header className="wgsa-filter__header">
          <label className="wgsa-filter__search">
            <i className="material-icons">search</i>
            <input
              type="text"
              placeholder="Search"
              value={textValue}
              onChange={(e) => this.onChange(e.target.value)}
            />
          </label>
        </header>
        <div className="wgsa-filter__content">
          { children.map(c => React.cloneElement(c, { isLoading: loading })) }
          { prefilter === 'bin' &&
            <p className="pw-bin-notice">
              Binned items are removed after 30 days.
            </p> }
        </div>
        <footer className="wgsa-filter__footer">
          <button
            className="mdl-button mdl-js-button mdl-button--primary"
            onClick={clear}
          >
            Clear Filters
          </button>
        </footer>
      </aside>
    );
  }

}

export default FilterAside;
