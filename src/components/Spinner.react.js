import React from 'react';

export default React.createClass({

  componentDidMount() {
    componentHandler.upgradeElement(this.refs.spinner);
  },

  render() {
    return (
      <div ref="spinner" className="mdl-spinner mdl-js-spinner is-active"></div>
    );
  },

});
