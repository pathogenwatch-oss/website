import '../../css/search.css';

import React from 'react';

import UploadedCollectionStore from '^/stores/UploadedCollectionStore';
import FilteredDataStore from '^/stores/FilteredDataStore';

import FilteredDataActionCreators from '^/actions/FilteredDataActionCreators';

export default React.createClass({

  displayName: 'Search',

  getInitialState() {
    return {
      filteredAmount: FilteredDataStore.getAssemblyIds().length,
      focus: false,
    };
  },

  componentDidMount() {
    FilteredDataStore.addChangeListener(this.handleFilteredDataStoreChange);
  },

  componentWillUnmount() {
    FilteredDataStore.removeChangeListener(this.handleFilteredDataStoreChange);
  },

  render() {
    const totalAssemblies = UploadedCollectionStore.getAssemblyIds().length;
    const { filteredAmount, focus } = this.state;
    return (
      <div className="wgsa-search-box-container">
        <div className={`wgsa-search-box ${ focus ? 'wgsa-search-box--active' : ''}`.trim()}
          onClick={this.handleClick}>
          <i className="wgsa-search-box__icon material-icons">search</i>
          <input ref="input"
            className="wgsa-search-box__input"
            placeholder={`SEARCH ${FilteredDataStore.getFilterColumnName()}`}
            onChange={this.handleChange}
            onFocus={this.handleFocus} onBlur={this.handleBlur} />
          <p className="wgsa-search-box__numbers">
            {filteredAmount} of {totalAssemblies}
          </p>
        </div>
      </div>
    );
  },

  handleChange(event) {
    FilteredDataActionCreators.setTextFilter(event.target.value);
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

  handleFilteredDataStoreChange() {
    this.setState({
      filteredAmount: FilteredDataStore.getAssemblyIds().length,
    });
  },

});
