import React from 'react';
import { connect } from 'react-redux';
import { List } from 'react-virtualized';

import SignInLink from '../../../sign-in/SignInLink.react';

import { getSelectedGenomeIds, getSelectedGenomeList } from '../selectors';
import { canCreateCollection as getCreateCollectionPermission } from '../../create-collection-form/selectors';

import {
  removeFromSelection,
  clearSelection,
  toggleDropdown,
} from '../actions';
import { showGenomeReport } from '../../../genome-report/actions';
import { setBinnedFlag } from '../../bin/actions';

import config from '../../../app/config';
const { user } = config;

const Selection = ({
  clearAll,
  removeGenome,
  selectedGenomes,
  sendToBin,
  showGenome,
  toggle,
  canCreateCollection,
}) => (
  <div className="wgsa-genome-selection">
    <header className="wgsa-dropdown-header">
      Selection
      <button
        className="wgsa-button--text wgsa-clear-selection"
        onClick={clearAll}
      >
        Clear All
      </button>
    </header>
    <List
      height={278}
      width={438}
      style={{ overflowX: 'hidden' }}
      className="wgsa-genome-selection-list"
      rowCount={selectedGenomes.length}
      rowHeight={32}
      rowRenderer={({ key, index, style }) => {
        const genome = selectedGenomes[index];
        return (
          <li
            key={key}
            className="wgsa-list-item"
            style={{ ...style, width: 440, top: style.top + 8 }}
          >
            <button
              className="wgsa-link-button"
              title="View report"
              onClick={() => showGenome(genome)}
            >
              {genome.name}
            </button>
            <button
              title="Remove from selection"
              onClick={e => {
                e.stopPropagation();
                removeGenome(genome);
              }}
              className="mdl-button mdl-button--icon"
            >
              <i className="material-icons">clear</i>
            </button>
          </li>
        );
      }}
    />
    <footer className="wgsa-dropdown-footer">
      {!!user && (
        <div>
          <button
            className="mdl-button mdl-button--icon"
            onClick={() => sendToBin(selectedGenomes)}
            title="Send to bin"
          >
            <i className="material-icons">delete_sweep</i>
          </button>
          <button
            title="Edit metadata"
            className="mdl-button"
            onClick={() => toggle('edit')}
          >
            Edit
          </button>
        </div>
      )}
      {canCreateCollection ? (
        <span key="can-create-collection">
          <button className="mdl-button" onClick={() => toggle('download')}>
            Download Data
          </button>
          {!!user ? (
            <button
              key="create-collection"
              className="mdl-button mdl-button--raised mdl-button--colored"
              onClick={() => toggle('collection')}
            >
              Create Collection
            </button>
          ) : (
            <SignInLink
              key="create-collection"
              className="mdl-button mdl-button--raised mdl-button--colored"
            >
              Sign in to Create Collection
            </SignInLink>
          )}
        </span>
      ) : (
        <button
          key="download-only"
          className="mdl-button mdl-button--raised mdl-button--colored"
          onClick={() => toggle('download')}
        >
          Download Data
        </button>
      )}
    </footer>
  </div>
);

function mapStateToProps(state) {
  return {
    selectedGenomes: getSelectedGenomeList(state),
    selectedGenomeIds: getSelectedGenomeIds(state),
    canCreateCollection: getCreateCollectionPermission(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    clearAll: () => dispatch(clearSelection()),
    removeGenome: genome => dispatch(removeFromSelection([ genome ])),
    showGenome: genome => dispatch(showGenomeReport(genome.id, genome.name)),
    sendToBin: genomes => dispatch(setBinnedFlag(genomes, true)),
    toggle: view => dispatch(toggleDropdown(view)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Selection);
