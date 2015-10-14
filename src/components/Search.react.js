import '../css/search.css';

import React from 'react';

import FilteredDataActionCreators from '../actions/FilteredDataActionCreators';

export default React.createClass({

  render() {
    return (
      <div className="wgsa-search-box">
        <div className="wgsa-search-box__flex-container">
          <i className="wgsa-search-box__icon material-icons">search</i>
          <input className="wgsa-search-box__input" placeholder="Search..." onChange={this.handleChange} />
        </div>
      </div>
    );
  },

  handleChange(event) {
    FilteredDataActionCreators.setTextFilter(event.target.value);
  },

});
