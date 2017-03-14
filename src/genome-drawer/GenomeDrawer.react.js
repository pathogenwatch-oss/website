import React from 'react';
// import classnames from 'classnames';

import Drawer from '../drawer';
import RemoveButton from '../genomes/card/RemoveButton.react';
import AddToSelectionButton from '../genomes/card/AddToSelectionButton.react';
import N50Chart from './N50Chart.react';

const GenomeStats = ({ metrics }) => (
  <dl className="wgsa-hub-stats-view">
    <span className="wgsa-hub-stats-section wgsa-hub-stats-section--small">
      <dt className="wgsa-hub-stats-heading">Genome Length</dt>
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

const GenomeDrawerContent = React.createClass({

  componentDidMount() {
    componentHandler.upgradeDom();
  },

  render() {
    const { genome } = this.props;
    return (
      <div className="wgsa-genome-drawer-content">
        <div className="mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
          <div className="mdl-tabs__tab-bar">
            <a href="#metrics-panel" className="mdl-tabs__tab is-active">Metrics</a>
            <a href="#n50-panel" className="mdl-tabs__tab">N50</a>
            <div className="wgsa-tab-actions">
              <AddToSelectionButton genome={genome} />
              <RemoveButton genome={genome} />
            </div>
          </div>
          <div className="mdl-tabs__panel is-active" id="metrics-panel">
            { genome && <GenomeStats metrics={genome.metrics} /> }
          </div>
          <div className="mdl-tabs__panel" id="n50-panel">
            { genome && <N50Chart metrics={genome.metrics} /> }
          </div>
        </div>
      </div>
    );
  },

});

export default ({ genome, onClose, ...props }) => (
  <Drawer {...props} isOpen onClose={onClose} animationKey={genome && genome.name}>
    <GenomeDrawerContent genome={genome} />
  </Drawer>
);
