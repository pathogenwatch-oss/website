import React from 'react';

export default React.createClass({

  displayName: 'Progress Bar',

  propTypes: {
    progress: React.PropTypes.number,
    indeterminate: React.PropTypes.bool,
  },

  componentDidMount() {
    const { progressBar } = this.refs;

    progressBar.addEventListener('mdl-componentupgraded', (event) => {
      this.progressBar = event.target.MaterialProgress;
      this.setProgress();
    });

    componentHandler.upgradeElement(progressBar);
  },

  componentDidUpdate() {
    this.setProgress();
  },

  setProgress() {
    if ('progress' in this.props) {
      this.progressBar.setProgress(this.props.progress);
    }
  },

  render() {
    const classes = `mdl-progress mdl-js-progress ${this.props.indeterminate ? 'mdl-progress__indeterminate' : ''}`.trim();
    return (
      <div ref="progressBar" className={classes}>
      </div>
    );
  },

});
