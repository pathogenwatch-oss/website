import React from 'react';
import classnames from 'classnames';

function formatCount(count) {
  if (count > 9999) {
    return `${Math.round(count / 1000)}K`;
  }
  return count;
}

const FilterItem = ({ item, onClick, renderLabel }) => {
  const { value, label = value, title = label, count, active } = item;
  return (
    <button
      title={title}
      className={classnames('mdl-chip mdl-chip--contact', {
        'mdl-chip--active': active,
      })}
      onClick={() => onClick(value)}
    >
      <span className="mdl-chip__contact">{formatCount(count)}</span>
      <span className="mdl-chip__text">{renderLabel(item)}</span>
    </button>
  );
};

function getActiveItem({ autoSelect = true, filterActive, summary = [], totalVisible }) {
  if (filterActive && summary.length === 1 && summary[0].count === totalVisible && autoSelect) {
    return summary[0];
  }
  return null;
}

function isSectionHidden({ children, disabled, hidden, summary = [] }) {
  if (children) return false;
  return !!hidden || !disabled && summary.length === 0;
}

const FilterSection = React.createClass({
  getInitialState() {
    return {
      activeItem: getActiveItem(this.props),
      isHidden: isSectionHidden(this.props),
      isOpen: false,
    };
  },

  componentWillReceiveProps(nextProps) {
    const { activeItem, isHidden, isOpen } = this.state;
    this.setState({
      activeItem: nextProps.isLoading && !activeItem ? activeItem : getActiveItem(nextProps),
      isHidden: nextProps.isLoading ? isHidden : isSectionHidden(nextProps),
      isOpen: nextProps.isLoading ? false : isOpen,
    });
  },

  toggle(isOpen) {
    this.setState({ isOpen: !isOpen });
  },

  render() {
    if (this.state.isHidden) {
      return null;
    }

    const {
      children,
      filterKey,
      heading,
      icon,
      summary = [],
      updateFilter,
      renderLabel = ({ value, label = value }) => label,
    } = this.props;
    const { activeItem, isOpen } = this.state;

    const onClick = value => updateFilter(filterKey, value);

    if (activeItem) {
      const { value, label = value, title, activeTitle = title } = activeItem;
      const autoSelected = !activeItem.active;

      let titleAttr = activeTitle || `${heading}: ${label}`;
      if (autoSelected) titleAttr += ' (selected automatically)';

      return (
        <section
          className="wgsa-filter-section is-active"
          style={!autoSelected ? { cursor: 'pointer' } : undefined}
        >
          <h3
            title={titleAttr}
            onClick={autoSelected ? null : () => onClick(value)}
          >
            <i className="material-icons">{icon}</i>
            <span>{renderLabel({ ...activeItem, active: true })}</span>
            {!autoSelected && <i className="material-icons">filter_list</i>}
          </h3>
        </section>
      );
    }

    const { disabled, disabledText, className } = this.props;

    if (disabled) {
      return (
        <section className="wgsa-filter-section is-disabled">
          <h3 title={disabledText}>
            <i className="material-icons">{icon}</i>
            <span>{heading}</span>
          </h3>
        </section>
      );
    }

    return (
      <section
        className={classnames('wgsa-filter-section', className, {
          'is-open': isOpen,
        })}
      >
        <h3 onClick={() => this.toggle(isOpen)}>
          <i className="material-icons">{icon}</i>
          <span>{heading}</span>
          <i className="material-icons">
            {isOpen ? 'expand_less' : 'expand_more'}
          </i>
        </h3>
        {isOpen && (
          <React.Fragment>
            {children ||
              summary.map(item => {
                if (item.active) return null;
                return (
                  <FilterItem
                    key={item.value}
                    item={item}
                    onClick={onClick}
                    renderLabel={renderLabel}
                  />
                );
              })}
          </React.Fragment>
        )}
      </section>
    );
  },
});

export default FilterSection;
