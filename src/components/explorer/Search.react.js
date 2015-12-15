import '../../css/search.css';

import React from 'react';
import { connect } from 'react-redux';

import { activateFilter, resetFilter } from '^/actions/filter';

import { formatColumnLabel } from '^/constants/table';

const Search = React.createClass({

  displayName: 'Search',

  propTypes: {
    filteredAmount: React.PropTypes.number,
    totalAmount: React.PropTypes.number,
    filterColumnName: React.PropTypes.string,
    handleChange: React.PropTypes.func,
  },

  getInitialState() {
    return {
      focus: false,
    };
  },

  render() {
    const { totalAmount, filteredAmount, filterColumnName } = this.props;
    const { focus } = this.state;
    return (
      <div className="wgsa-search-box-container">
        <div className={`wgsa-search-box ${ focus ? 'wgsa-search-box--active' : ''}`.trim()}
          onClick={this.handleClick}>
          <i className="wgsa-search-box__icon material-icons">search</i>
          <input ref="input"
            className="wgsa-search-box__input"
            placeholder={`SEARCH ${filterColumnName}`}
            onChange={this.handleChange}
            onFocus={this.handleFocus} onBlur={this.handleBlur} />
          <p className="wgsa-search-box__numbers">
            {filteredAmount} of {totalAmount}
          </p>
        </div>
      </div>
    );
  },

  handleChange(event) {
    this.props.handleChange(event.target.value);
  },

  handleFocus() {
    this.setState({ focus: true });
  },

  handleBlur() {
    this.setState({ focus: false });
  },

  handleClick() {
    this.refs.input.focus();
  },

});

function mapStateToProps({ tables, filter, entities }) {
  const { activeColumn } = tables.metadata;
  const totalAmount = filter.unfilteredIds.size;
  return {
    displayProps: {
      totalAmount,
      filteredAmount: filter.active ? filter.ids.size : totalAmount,
      filterColumnName: formatColumnLabel(activeColumn.columnKey),
    },
    activeColumn,
    assemblies: [ ...filter.unfilteredIds ].map(id => entities.assemblies[id]),
  };
}

function mergeProps({ displayProps, activeColumn, assemblies }, { dispatch }) {
  return {
    ...displayProps,
    handleChange(text) {
      if (!text || !text.length) {
        return dispatch(resetFilter());
      }
      const matcher = new RegExp(text, 'i');
      dispatch(activateFilter(
        assemblies.reduce(function (set, assembly) {
          if (('' + activeColumn.valueGetter(assembly)).match(matcher)) {
            set.add(assembly.metadata.assemblyId);
          }
          return set;
        }, new Set())
      ));
    },
  };
}

export default connect(mapStateToProps, null, mergeProps)(Search);
