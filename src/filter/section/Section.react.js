import React from 'react';
import classnames from 'classnames';

function formatCount(count) {
  if (count > 9999) {
    return `${Math.round(count / 1000)}K`;
  }
  return count;
}

const FilterItem = ({ value, title, label, count, active, onClick }) =>
  <button
    title={title || label}
    className={classnames(
      'mdl-chip mdl-chip--contact',
      { 'mdl-chip--active': active }
    )}
    onClick={() => onClick(value)}
  >
    <span className="mdl-chip__contact">{formatCount(count)}</span>
    <span className="mdl-chip__text">{label || value}</span>
  </button>;

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

    const activeItem = summary.find(_ => _.active);
    const onClick = (value) => updateFilter(filterKey, value);

    return (
      <section
        className={classnames(
          'wgsa-filter-section', className, { 'is-open': isOpen, active: activeItem })
        }
      >
        <h3 onClick={() => this.toggle(isOpen)}>
          <i className="material-icons">{icon}</i>
          <span>{heading}</span>
          { activeItem && <i className="material-icons" style={{ padding: '0 4px' }}>filter_list</i> }
          <i className="material-icons">{isOpen ? 'expand_less' : 'expand_more'}</i>
        </h3>
        { isOpen && (
          <React.Fragment>
            { activeItem && <FilterItem {...activeItem} onClick={onClick} /> }
            { children ||
              summary.map(props => {
                if (props.active) return null;
                return <FilterItem key={props.value} {...props} onClick={onClick} />;
              }) }
          </React.Fragment>
        )}
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
