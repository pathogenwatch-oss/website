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

const FilterSection = React.createClass({
  getInitialState() {
    return {
      isOpen: false,
      clicked: false,
    };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.isLoading) {
      this.setState({
        isOpen: false,
      });
    } else if (
      this.state.clicked &&
      this.props.isLoading &&
      !nextProps.isLoading
    ) {
      this.setState({
        clicked: false,
        isOpen: true,
      });
    }
  },

  toggle(isOpen) {
    this.setState({ isOpen: !isOpen });
  },

  render() {
    const {
      children,
      isActive,
      isLoading,
      filterKey,
      heading,
      icon,
      summary = [],
      updateFilter,
      renderLabel = ({ label }) => label,
    } = this.props;
    const { isOpen } = this.state;

    const activeItem = isActive && !isLoading && summary.length === 1 ? summary[0] : null;
    const onClick = value => updateFilter(filterKey, value);

    if (activeItem) {
      const { label, value, title, activeTitle = title } = activeItem;
      const autoSelected = !activeItem.active;

      let titleAttr = activeTitle || `${heading}: ${label}`;
      if (autoSelected) titleAttr += ' (automatically selected)';

      const clickHandler = () => { this.setState({ clicked: true }); onClick(value); };

      return (
        <section className="wgsa-filter-section is-active">
          <h3
            title={titleAttr}
            onClick={autoSelected ? null : clickHandler}
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

export default props => {
  if (
    props.children ||
    (props.disabled && !props.hidden) ||
    (props.summary && props.summary.length)
  ) {
    return <FilterSection {...props} />;
  }
  return null;
};
