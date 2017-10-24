import React from 'react';
import classnames from 'classnames';

export default createClass({

  displayName: 'Progress Bar',

  propTypes: {
    className: PropTypes.string,
    progress: PropTypes.number,
    indeterminate: PropTypes.bool,
    label: PropTypes.string,
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
    return (
      <div className="wgsa-progress-bar">
        { label ? <label className="wgsa-progress-bar__label">{label}</label> : null }
        <div ref="progressBar"
          className={classnames(
            className,
            'mdl-progress mdl-js-progress',
            { 'mdl-progress__indeterminate': indeterminate }
          )}
        />
      </div>
    );
  },

});
