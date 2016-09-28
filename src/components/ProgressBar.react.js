import React from 'react';

export default React.createClass({

  displayName: 'Progress Bar',

  propTypes: {
    className: React.PropTypes.string,
    progress: React.PropTypes.number,
    indeterminate: React.PropTypes.bool,
    label: React.PropTypes.string,
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
    const { className, indeterminate, label } = this.props;
    const classes = `${className} mdl-progress mdl-js-progress ${indeterminate ? 'mdl-progress__indeterminate' : ''}`.trim();
    return (
      <div className="wgsa-progress-bar">
        { label ? <label className="wgsa-progress-bar__label">{label}</label> : null }
        <div ref="progressBar" className={classes} />
      </div>
    );
  },

});
