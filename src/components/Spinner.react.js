import React from 'react';
import classnames from 'classnames';

export default createClass({

  componentDidMount() {
    componentHandler.upgradeElement(this.refs.spinner);
  },

  render() {
    return (
      <div
        ref="spinner"
        className={classnames(
          'mdl-spinner mdl-js-spinner is-active',
          { 'mdl-spinner--single-colour': this.props.singleColour }
        )}
      ></div>
    );
  },

});
