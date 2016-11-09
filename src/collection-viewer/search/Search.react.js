import './styles.css';

import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { activateFilter, resetFilter } from '../filter/actions';
import { getFilter } from '../selectors';

import { utils } from '../../table';

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

  render() {
    const { totalAmount, filteredAmount, filterColumnName } = this.props;
    const { focus } = this.state;
    return (
      <div className="wgsa-search-box-container">
        <div className={classnames(
          'wgsa-search-box',
          { 'wgsa-search-box--active': focus }
        )}
          onClick={this.handleClick}
        >
          <i className="wgsa-search-box__icon material-icons">search</i>
          <input ref="input"
            className="wgsa-search-box__input"
            placeholder={`SEARCH ${filterColumnName}`}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
          <p className="wgsa-search-box__numbers">
            {filteredAmount} of {totalAmount}
          </p>
        </div>
      </div>
    );
  },

});

function mapStateToProps(state) {
  const { tables, entities } = state;
  const filter = getFilter(state);
  const { activeColumn } = tables.metadata;
  const totalAmount = filter.unfilteredIds.size;
  return {
    displayProps: {
      totalAmount,
      filteredAmount: filter.active ? filter.ids.size : totalAmount,
      filterColumnName: utils.getColumnLabel(activeColumn),
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
        dispatch(resetFilter());
        return;
      }
      const matcher = new RegExp(text, 'i');
      dispatch(activateFilter(
        assemblies.reduce((set, assembly) => {
          if (String(activeColumn.valueGetter(assembly)).match(matcher)) {
            set.add(assembly.metadata.assemblyId);
          }
          return set;
        }, new Set())
      ));
    },
  };
}

export default connect(mapStateToProps, null, mergeProps)(Search);
