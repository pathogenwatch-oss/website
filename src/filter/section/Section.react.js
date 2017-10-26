import React from 'react';
import classnames from 'classnames';

function formatCount(count) {
  if (count > 9999) {
    return `${Math.round(count / 1000)}K`;
  }
  return count;
}

const FilterSection = React.createClass({

  getInitialState() {
    const { summary, expanded = summary.some(_ => _.active) } = this.props;
    return {
      isOpen: expanded,
    };
  },

  toggle(isOpen) {
    this.setState({ isOpen: !isOpen });
  },

  render() {
    const {
      heading, icon, summary = [], updateFilter, filterKey, className, children,
    } = this.props;
    const { isOpen } = this.state;

    if (!children && !summary.length) {
      return null;
    }

    return (
      <section
        className={classnames(
          'wgsa-filter-section', className, { 'is-open': isOpen })
        }
      >
        <h3 onClick={() => this.toggle(isOpen)}>
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
            <span className="mdl-chip__contact">{formatCount(count)}</span>
            <span className="mdl-chip__text">{label || value}</span>
          </button>
        ))}
      </section>
    );
  },

});

export default props => {
  if (props.children || props.summary && props.summary.length) {
    return <FilterSection {...props} />;
  }
  return null;
};
