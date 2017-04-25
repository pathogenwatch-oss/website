import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { GenomeArchiveButton } from '../../downloads';
import CreateCollectionForm from '../create-collection-form';
import Stats from '../stats';

import { getSelectedGenomeIds, getSelectedGenomeList } from './selectors';

import { setSelection, unselectGenomes } from './actions';

import config from '../../app/config';

const { maxArchiveSize = 100 } = config;

const Tab = ({ onClick, id, activeTab, children }) => (
  <a
    href={`#${id}`}
    onClick={e => onClick(e, id)}
    className={classnames('mdl-tabs__tab', { 'is-active': id === activeTab })}
  >
    {children}
  </a>
);

const TabContent = ({ isActive, children }) => (
  isActive ?
    <div className="mdl-tabs__panel is-active">{children}</div> :
    null
);

const SelectionDrawer = React.createClass({

  getInitialState() {
    return {
      activeTab: 'create-collection-panel',
    };
  },

  onTabClick(e, activeTab) {
    e.preventDefault();
    this.setState({ activeTab });
  },

  getDownloadTitle() {
    if (this.props.disableDownload) {
      return `A single archive cannot contain more than ${maxArchiveSize} genomes at this time.`;
    }
    return 'Download Selection';
  },

  render() {
    const { selectedGenomes, removeGenome, disableDownload } = this.props;
    const { activeTab } = this.state;
    return (
      <div className="wgsa-selection-tabs mdl-tabs is-upgraded wgsa-drawer__content">
        <div className="mdl-tabs__tab-bar mdl-tabs__tab-bar--start">
          <Tab id="create-collection-panel" onClick={this.onTabClick} activeTab={activeTab}>Create Collection</Tab>
          <Tab id="selection-panel" onClick={this.onTabClick} activeTab={activeTab}>Selection</Tab>
          <Tab id="stats-panel" onClick={this.onTabClick} activeTab={activeTab}>Stats</Tab>
          <div className="wgsa-tab-actions">
            <GenomeArchiveButton
              ids={this.props.selectedGenomeIds}
              filename="wgsa-genome-selection"
              title={this.getDownloadTitle()}
              disabled={disableDownload}
            />
          </div>
        </div>
        <TabContent isActive={activeTab === 'create-collection-panel'}>
          <CreateCollectionForm />
        </TabContent>
        <TabContent isActive={activeTab === 'selection-panel'}>
          { selectedGenomes.map(genome =>
              <span key={genome.id} className="mdl-chip mdl-chip--deletable wgsa-inline-chip">
                <span className="mdl-chip__text">{genome.name}</span>
                <button
                  type="button"
                  title="Remove genome"
                  className="mdl-chip__action"
                  onClick={() => removeGenome(genome)}
                >
                  <i className="material-icons">remove_circle_outline</i>
                </button>
              </span>
          )}
        </TabContent>
        <TabContent isActive={activeTab === 'stats-panel'}>
          <Stats />
        </TabContent>
      </div>
    );
  },

});

function mapStateToProps(state) {
  const selectedGenomes = getSelectedGenomeList(state);
  return {
    selectedGenomes,
    selectedGenomeIds: getSelectedGenomeIds(state),
    disableDownload: selectedGenomes.length > maxArchiveSize,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    clearSelection: () => dispatch(setSelection([])),
    removeGenome: genome => dispatch(unselectGenomes([ genome ])),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectionDrawer);
