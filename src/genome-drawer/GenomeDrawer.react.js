import React from 'react';

import Drawer from '../drawer';
import RemoveButton from '../genomes/card/RemoveButton.react';
import AddToSelectionButton from '../genomes/card/AddToSelectionButton.react';
import DownloadLink from '../downloads/GenomeFileLink.react';
import Spinner from '../components/Spinner.react';

import Overview from './Overview.react';
import Metadata from './Metadata.react';
import getAnalysisTabs from './analysis';

const GenomeDrawerContent = React.createClass({

  componentDidMount() {
    componentHandler.upgradeDom();
  },

  render() {
    const { genome } = this.props;
    const { analysis = {}, pending = [] } = genome;
    const analysisTabs = getAnalysisTabs(analysis);
    return (
      <div className="wgsa-genome-drawer-content wgsa-drawer__content">
        <div className="mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
          <div className="mdl-tabs__tab-bar">
            <a href="#overview-panel" className="mdl-tabs__tab is-active">Overview</a>
            <a href="#metadata-panel" className="mdl-tabs__tab">Metadata</a>
            {
              analysisTabs.map(({ key }) => <a key={key} href={`#${key.toLowerCase()}-panel`} className="mdl-tabs__tab">{key}</a>)
            }
            <div className="wgsa-tab-actions">
              { pending.length > 0 && <span className="wgsa-tab-actions__label">+{pending.length} pending</span>}
              <RemoveButton genome={genome} />
              <DownloadLink id={genome.id} name={genome.name} />
              <AddToSelectionButton genome={genome} />
            </div>
          </div>
          <div className="mdl-tabs__panel is-active" id="overview-panel">
            <Overview genome={genome} />
          </div>
          <div className="mdl-tabs__panel" id="metadata-panel">
            <Metadata genome={genome} />
          </div>
          {
            analysisTabs.map(({ key, component }) =>
              <div
                key={key}
                id={`${key.toLowerCase()}-panel`}
                className="mdl-tabs__panel"
              >{component}</div>)
          }
        </div>
      </div>
    );
  },

});

export default ({ name, genome, loading, close }) => {
  const isOpen = !!loading || !!genome;
  return (
    <Drawer
      title={name}
      isOpen={isOpen}
      onHeaderClick={close}
      animationKey={genome && genome.name}
      className="wgsa-genome-drawer"
    >
      { loading ?
        <div className="wgsa-drawer__content wgsa-drawer-loader">
          <Spinner />
        </div> :
        <GenomeDrawerContent genome={genome} />
      }
    </Drawer>
  );
};
