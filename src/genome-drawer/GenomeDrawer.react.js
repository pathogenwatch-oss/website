import React from 'react';

import Drawer from '../drawer';
import RemoveButton from '../genomes/card/RemoveButton.react';
import AddToSelectionButton from '../genomes/card/AddToSelectionButton.react';
import DownloadLink from '../downloads/GenomeFileLink.react';
import Spinner from '../components/Spinner.react';

import GenomeMetadata from './GenomeMetadata.react';
import GenomeStats from './GenomeStats.react';
import N50Chart from './N50Chart.react';
import GenomeAnalysis from './analysis';

const GenomeDrawerContent = React.createClass({

  componentDidMount() {
    componentHandler.upgradeDom();
  },

  render() {
    const { genome } = this.props;
    const { analysis = {} } = genome;
    const { metrics } = analysis;
    return (
      <div className="wgsa-genome-drawer-content wgsa-drawer__content">
        <div className="mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
          <div className="mdl-tabs__tab-bar">
            <a href="#metadata-panel" className="mdl-tabs__tab is-active">Metadata</a>
            <a href="#metrics-panel" className="mdl-tabs__tab">Metrics</a>
            <a href="#n50-panel" className="mdl-tabs__tab">N50</a>
            <a href="#analysis-panel" className="mdl-tabs__tab">Analysis</a>
            <div className="wgsa-tab-actions">
              <RemoveButton genome={genome} />
              <DownloadLink id={genome.id} name={genome.name} />
              <AddToSelectionButton genome={genome} />
            </div>
          </div>
          <div className="mdl-tabs__panel is-active" id="metadata-panel">
            <GenomeMetadata genome={genome} />
          </div>
          <div className="mdl-tabs__panel" id="metrics-panel">
            { metrics && <GenomeStats metrics={metrics} /> }
          </div>
          <div className="mdl-tabs__panel" id="n50-panel">
            { metrics && <N50Chart metrics={metrics} /> }
          </div>
          <div className="mdl-tabs__panel" id="analysis-panel">
            <GenomeAnalysis analysis={analysis} />
          </div>
        </div>
      </div>
    );
  },

});

export default ({ genome, loading, close }) => {
  const isOpen = !!loading || !!genome;
  const title = genome ? genome.name : null;
  return (
    <Drawer title={title} isOpen={isOpen} onHeaderClick={close} animationKey={genome && genome.name}>
      { loading ?
        <div className="wgsa-drawer__content wgsa-drawer-loader">
          <Spinner />
        </div> :
        <GenomeDrawerContent genome={genome} /> }
    </Drawer>
  );
};
