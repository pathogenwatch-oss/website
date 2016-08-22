import React from 'react';

export default React.createClass({

  displayName: 'Progress Bar',

  propTypes: {
    progress: React.PropTypes.number,
  },

  componentDidMount() {
    const { progressBar } = this.refs;

    progressBar.addEventListener('mdl-componentupgraded', (event) => {
      this.progressBar = event.target.MaterialProgress;
      this.progressBar.setProgress(this.props.progress);
    });

    componentHandler.upgradeElement(progressBar);
  },

  componentDidUpdate() {
    this.progressBar.setProgress(this.props.progress);
  },

  render() {
    return (
      <div ref="progressBar" className="mdl-progress mdl-js-progress"></div>
    );
  },

});
