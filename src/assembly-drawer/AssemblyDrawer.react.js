import React from 'react';
// import classnames from 'classnames';

import Drawer from '../drawer';
import N50Chart from './N50Chart.react';

const AssemblyStats = ({ metrics }) => (
  <dl className="wgsa-hub-stats-view">
    <span className="wgsa-hub-stats-section wgsa-hub-stats-section--small">
      <dt className="wgsa-hub-stats-heading">Assembly Length</dt>
      <dd className="wgsa-hub-stats-value">{metrics.totalNumberOfNucleotidesInDnaStrings}</dd>
    </span>
    <span className="wgsa-hub-stats-section wgsa-hub-stats-section--small">
      <dt className="wgsa-hub-stats-heading">No. Contigs</dt>
      <dd className="wgsa-hub-stats-value">{metrics.totalNumberOfContigs}</dd>
    </span>
    <span className="wgsa-hub-stats-section wgsa-hub-stats-section--small">
      <dt className="wgsa-hub-stats-heading">Smallest Contig</dt>
      <dd className="wgsa-hub-stats-value">{metrics.smallestNumberOfNucleotidesInDnaStrings}</dd>
    </span>
    <span className="wgsa-hub-stats-section wgsa-hub-stats-section--small">
      <dt className="wgsa-hub-stats-heading">Largest Contig</dt>
      <dd className="wgsa-hub-stats-value">{metrics.biggestNumberOfNucleotidesInDnaStrings}</dd>
    </span>
    <span className="wgsa-hub-stats-section wgsa-hub-stats-section--small">
      <dt className="wgsa-hub-stats-heading">Average Contig Length</dt>
      <dd className="wgsa-hub-stats-value">{metrics.averageNumberOfNucleotidesInDnaStrings}</dd>
    </span>
    <span className="wgsa-hub-stats-section wgsa-hub-stats-section--small">
      <dt className="wgsa-hub-stats-heading">N50</dt>
      <dd className="wgsa-hub-stats-value">{metrics.contigN50}</dd>
    </span>
    <span className="wgsa-hub-stats-section wgsa-hub-stats-section--small">
      <dt className="wgsa-hub-stats-heading">Non-ATCG</dt>
      <dd className="wgsa-hub-stats-value">{metrics.totalNumberOfNsInDnaStrings}</dd>
    </span>
    <span className="wgsa-hub-stats-section wgsa-hub-stats-section--small">
      <dt className="wgsa-hub-stats-heading">GC Content</dt>
      <dd className="wgsa-hub-stats-value">{metrics.gcContent}%</dd>
    </span>
  </dl>
);

const AssemblyDrawerContent = React.createClass({

  componentDidMount() {
    componentHandler.upgradeDom();
  },

  render() {
    const { assembly } = this.props;
    return (
      <div className="wgsa-assembly-drawer-content">
        <div className="mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
          <div className="mdl-tabs__tab-bar">
            <a href="#stats-panel" className="mdl-tabs__tab is-active">Stats</a>
            <a href="#n50-panel" className="mdl-tabs__tab">N50</a>
          </div>
          <div className="mdl-tabs__panel is-active" id="stats-panel">
            { assembly && <AssemblyStats metrics={assembly.metrics} /> }
          </div>
          <div className="mdl-tabs__panel" id="n50-panel">
            { assembly && <N50Chart metrics={assembly.metrics} /> }
          </div>
        </div>
      </div>
    );
  },

});

export default ({ assembly, onClose, ...props }) => (
  <Drawer {...props} isOpen onClose={onClose}>
    <AssemblyDrawerContent assembly={assembly} />
  </Drawer>
);
