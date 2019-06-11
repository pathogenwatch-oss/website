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

export const Metadata = ({ label, children, inline }) => (
  hasValue(children) ?
    <div className={classnames('pw-genome-report-metadata', { inline })}>
      <dt>{label}</dt>
      <dd>{formatValue(children)}</dd>
    </div> :
    null
);

export const Section = ({ heading, version, children }) => (
  <div>
    <h2>
      {heading}
      {version && <span className="wgsa-genome-detail-version">{version}</span>}
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

  getVersions() {
    const { genome, taskName } = this.props;
    const { tasks = [] } = genome;
    const versions = [];
    for (const { task, version } of tasks) {
      if (task !== taskName) continue;
      versions.push(
        <button
          key={version}
          className={classnames(
            'wgsa-analysis-version', {
              'is-active': version === this.state.version,
            })}
          onClick={() => this.setState({ version })}
        >
          {version}
        </button>
      );
    }
    return versions;
  },

  render() {
    const { genome, taskName } = this.props;
    const Component = this.props.component;
    const versions = this.getVersions(genome, taskName);
    return (
      <React.Fragment>
        { versions.length > 0 &&
          <aside className="wgsa-genome-detail-version">
            Version: { versions }
          </aside> }
        <Component result={genome.analysis[taskName]} genome={genome} />
      </React.Fragment>
    );
  },

});
