import '../../css/search.css';

import React from 'react';
import { connect } from 'react-redux';

const Search = React.createClass({

  displayName: 'Search',

  propTypes: {
    filteredAmount: React.PropTypes.number,
    totalAmount: React.PropTypes.number,
    filterColumnName: React.PropTypes.string,
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
    // FilteredDataActionCreators.setTextFilter(event.target.value);
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

function mapStateToProps({ entities }) {
  const { assemblies } = entities;
  const totalAmount = Object.keys(assemblies).length;
  return {
    totalAmount,
    filteredAmount: totalAmount,
    filterColumnName: 'ASSEMBLY',
  };
}

export default connect(mapStateToProps)(Search);
