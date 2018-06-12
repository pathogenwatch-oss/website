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

  componentWillReceiveProps({ summary = [] }) {
    const activeItem = summary.find(_ => _.active);
    this.setState({
      isActive: !!activeItem,
      isOpen: this.state.isActive ? activeItem : this.state.isOpen,
    });
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

    if (activeItem) {
      const { title, label, value } = activeItem;
      return (
        <section className="wgsa-filter-section active">
          <h3 title={`${heading}: ${title || label}`} onClick={() => onClick(value)}>
            <i className="material-icons">{icon}</i>
            <span>{label}</span>
            <i className="material-icons">filter_list</i>
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
  if (props.children || props.summary && props.summary.length) {
    return <FilterSection {...props} />;
  }
  return null;
};
