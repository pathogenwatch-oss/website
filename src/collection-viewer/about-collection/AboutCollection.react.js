import './styles.css';

import React from 'react';

export default React.createClass({

  getClassName() {
    return [
      'wgsa-about-collection-dropdown',
      'wgsa-header-dropdown wgsa-header-dropdown--right',
      this.props.isOpen ? 'wgsa-header-dropdown--is-open' : '',
    ].join(' ');
  },

  render() {
    const { organisms, metadata, onButtonClick } = this.props;
    return (
      <div className={this.getClassName()}>
        <button className="mdl-button mdl-button--icon" title="About Collection" onClick={onButtonClick}>
          <i className="material-icons">info</i>
        </button>
        <div className="wgsa-header-dropdown__content">
          <h4 className="wgsa-about-collection-dropdown__title">
            {metadata.title || 'About Collection'}
          </h4>
          <p>{metadata.description}</p>
          <dl>
            <dt className="wgsa-hub-stats-heading">Organisms</dt>
            <dd className="wgsa-hub-stats-value">{organisms}</dd>
          </dl>
          <dl>
            <dt className="wgsa-hub-stats-heading">Created</dt>
            <dd className="wgsa-hub-stats-value">{metadata.dateCreated}</dd>
          </dl>
        </div>
      </div>
    );
  },

});
