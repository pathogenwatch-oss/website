import React from 'react';
import classnames from 'classnames';

function hasValue(value) {
  return (
    value !== '' && typeof value !== 'undefined' && value !== null
  );
}

function formatValue(value) {
  if (React.isValidElement(value)) return value;

  if (Array.isArray(value)) {
    return <em>Array</em>;
  }

  if (typeof value === 'object') {
    return <em>Object</em>;
  }

  return value;
}

export const Metadata = ({ label, children }) => (
  hasValue(children) ?
  <div>
    <dt>{label}</dt>
    <dd>{formatValue(children)}</dd>
  </div> :
  null
);

export const Section = ({ heading, version, children }) => (
  <div className="wgsa-analysis-section">
    <h2 className="wgsa-analysis-title">
      {heading}
      {version && <span className="wgsa-analysis-version">{version}</span>}
    </h2>
    {children}
  </div>
);

export const VersionSwitcher = React.createClass({

  getInitialState() {
    const { genome, taskName } = this.props;
    const { analysis } = genome;
    return {
      version: analysis[taskName].__v,
    };
  },

  getResult() {
    const { genome, taskName } = this.props;
    return genome.analysis[taskName];
  },

  render() {
    const { genome, taskName } = this.props;
    const Component = this.props.component;
    return (
      <div>
        <aside className="wgsa-genome-detail-version">
          Version:
          { genome.tasks
            .filter(_ => _.task === taskName)
            .map(task =>
              <button key={task.version} className={classnames(
                'wgsa-analysis-version', {
                  'is-active': task.version === this.state.version,
                })}
                onClick={() => this.setState({ version: task.version })}
              >
                {task.version}
              </button>) }
        </aside>
        <Component result={this.getResult()} genome={genome} />
      </div>
    );
  },

});
