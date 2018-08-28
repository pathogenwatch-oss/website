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
      isActive: expanded,
    };
  },

  componentWillReceiveProps(nextProps) {
    const activeItem = nextProps.summary && nextProps.summary.find(_ => _.active);

    if (activeItem) {
      this.setState({
        isActive: true, // caches fact that we had an active item
      });
    } else if (this.state.isActive && nextProps.isLoading) {
      this.setState({
        isOpen: false,
      });
    } else if (this.state.isActive && this.props.isLoading && !nextProps.isLoading) {
      this.setState({
        isActive: false,
        isOpen: true,
      });
    }
  },

  toggle(isOpen) {
    this.setState({ isOpen: !isOpen });
  },

  render() {
    const { heading, icon, summary = [], updateFilter, filterKey, children } = this.props;
    const { isOpen } = this.state;

    const activeItem = summary.find(_ => _.active);
    const onClick = (value) => updateFilter(filterKey, value);

    if (activeItem) {
      const { title, label, value } = activeItem;
      return (
        <section className="wgsa-filter-section is-active">
          <h3 title={`${heading}: ${title || label}`} onClick={() => onClick(value)}>
            <i className="material-icons">{icon}</i>
            <span>{label}</span>
            <i className="material-icons">filter_list</i>
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
            {/* <i className="material-icons">{isOpen ? 'expand_less' : 'expand_more'}</i> */}
          </h3>
        </section>
      );
    }

    return (
      <section className={classnames('wgsa-filter-section', className, { 'is-open': isOpen })}>
        <h3 onClick={() => this.toggle(isOpen)}>
          <i className="material-icons">{icon}</i>
          <span>{heading}</span>
          <i className="material-icons">{isOpen ? 'expand_less' : 'expand_more'}</i>
        </h3>
        { isOpen && (
          <React.Fragment>
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
  if (props.children || (props.disabled && !props.hidden) || (props.summary && props.summary.length)) {
    return <FilterSection {...props} />;
  }
  return null;
};
