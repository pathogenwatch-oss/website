import React from 'react';
import classnames from 'classnames';

const FilterSection = React.createClass({

  getInitialState() {
    return {
      isOpen: false,
    };
  },

  toggle() {
    this.setState({ isOpen: !this.state.isOpen });
  },

  render() {
    const { heading, icon, summary = [], updateFilter, filterKey, children } = this.props;
    const { isOpen } = this.state;

    if (!children && !summary.length) {
      return null;
    }

    return (
      <section
        className={classnames('wgsa-filter-section', { 'is-open': isOpen })}
      >
        <h3 onClick={this.toggle}>
          <i className="material-icons">{icon}</i>
          {heading}
          <i className="material-icons">{isOpen ? 'expand_less' : 'expand_more'}</i>
        </h3>
        { isOpen && (
          children || summary.map(({ value, title, label, count, active }) =>
          <button
            key={value}
            title={title || label}
            className={classnames(
              'mdl-chip mdl-chip--contact',
              { 'mdl-chip--active': active }
            )}
            onClick={() => updateFilter(filterKey, value)}
          >
            <span className="mdl-chip__contact">{count}</span>
            <span className="mdl-chip__text">{label || value}</span>
          </button>
        ))}
      </section>
    );
  },

});

export default FilterSection;
