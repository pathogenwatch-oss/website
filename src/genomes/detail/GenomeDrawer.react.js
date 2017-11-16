import React from 'react';

import Modal from '../../components/modal';
import Fade from '../../components/fade';
import RemoveButton from './RemoveButton.react';
import AddToSelection from '../../genomes/selection/AddToSelection.react';

import DownloadLink from '../../downloads/GenomeFileLink.react';
import Spinner from '../../components/Spinner.react';

import Overview from './Overview.react';
import Metadata from './Metadata.react';
import getAnalysisTabs from './analysis';

const GenomeDrawerContent = React.createClass({

  componentDidMount() {
    componentHandler.upgradeDom();
  },

  render() {
    const { genome } = this.props;
    const { analysis = {}, pending = [], userDefined = null } = genome;
    const analysisTabs = getAnalysisTabs(analysis);
    const hasMetadata = userDefined && Object.keys(userDefined).length > 0;
    return (
      <div className="wgsa-genome-drawer-content mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
        <div className="mdl-tabs__tab-bar">
          <a href="#overview-panel" className="mdl-tabs__tab is-active">Overview</a>
          { hasMetadata && <a href="#metadata-panel" className="mdl-tabs__tab">Metadata</a>}
          {
            analysisTabs.map(({ key }) => <a key={key} href={`#${key.toLowerCase()}-panel`} className="mdl-tabs__tab">{key}</a>)
          }
          <div className="wgsa-tab-actions">
            { pending.length > 0 && <span className="wgsa-tab-actions__label">+{pending.length} pending</span>}
          </div>
        </div>
        <div className="mdl-tabs__panel is-active" id="overview-panel">
          <Overview genome={genome} />
        </div>
        { hasMetadata &&
          <div className="mdl-tabs__panel" id="metadata-panel">
            <Metadata genome={genome} />
          </div> }
        {
          analysisTabs.map(({ key, component }) =>
            <div
              key={key}
              id={`${key.toLowerCase()}-panel`}
              className="mdl-tabs__panel"
            >{component}</div>)
        }
      </div>
    );
  },

});

export default ({ name, genome, loading, close }) => {
  const isOpen = !!loading || !!genome;
  return (
    <Fade>
      { isOpen &&
        <Modal
          title={
            <span className="wgsa-genome-drawer-title">
              { genome &&
                <AddToSelection
                  genomes={[ genome ]}
                  className="mdl-button mdl-button--icon"
                /> }
              {genome ? genome.name : name}
            </span>
          }
          modal
          isOpen={isOpen}
          onClose={close}
          animationKey="genome-drawer"
          className="wgsa-genome-drawer"
          actions={genome ? [
            <DownloadLink key="download" id={genome.id} name={genome.name} />,
            <RemoveButton key="remove" genome={genome} onRemove={close} />,
          ] : []}
        >
          { loading ?
            <div className="wgsa-drawer__content wgsa-drawer-loader">
              <Spinner />
            </div> :
            <GenomeDrawerContent genome={genome} />
          }
        </Modal> }
    </Fade>
  );
};
