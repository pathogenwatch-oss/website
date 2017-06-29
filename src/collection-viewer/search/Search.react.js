import './styles.css';

import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import SearchDropdown from './SearchDropdown.react';

import { getGenomes } from '../../collection-viewer/selectors';
import { getActiveDataTable } from '../table/selectors';
import { getFilter } from '../selectors';

import { activateFilter, resetFilter } from '../filter/actions';

import { getColumnLabel } from '../table/utils';

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
          <SearchDropdown isOpen={focus} />
        </div>
      </div>
    );
  },

});

function mapStateToProps(state) {
  const filter = getFilter(state);
  const { activeColumn } = getActiveDataTable(state);
  const totalAmount = filter.unfilteredIds.length;
  return {
    displayProps: {
      totalAmount,
      filteredAmount: filter.active ? filter.ids.size : totalAmount,
      filterColumnName: getColumnLabel(activeColumn),
    },
    activeColumn,
    genomes: [ ...filter.unfilteredIds ].map(id => getGenomes(state)[id]),
  };
}

function mergeProps({ displayProps, activeColumn, genomes }, { dispatch }) {
  return {
    ...displayProps,
    handleChange(text) {
      if (!text || !text.length) {
        dispatch(resetFilter());
        return;
      }
      const matcher = new RegExp(text, 'i');
      dispatch(activateFilter(
        genomes.reduce((set, genome) => {
          if (String(activeColumn.valueGetter(genome)).match(matcher)) {
            set.add(genome.uuid);
          }
          return set;
        }, new Set())
      ));
    },
  };
}

export default connect(mapStateToProps, null, mergeProps)(Search);
