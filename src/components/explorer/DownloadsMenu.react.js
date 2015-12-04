import '../../css/dropdown-menu.css';

import React from 'react';
import { connect } from 'react-redux';

import DownloadMenuItem from './DownloadsMenuItem.react';
import DownloadButton from './DownloadButton.react';

import { setMenuActive } from '^/actions/download';

import Species from '^/species';


const DownloadsMenu = ({
  collectionId,
  assemblyIds,
  menuOpen,
  treeLinks,
  files,
  dispatch,
}) => (
  <div className={`wgsa-menu ${menuOpen ? 'wgsa-menu--is-open' : ''}`} onClick={e => e.stopPropagation()}>
    <button className="wgsa-menu-button mdl-button" onClick={() => dispatch(setMenuActive(!menuOpen))}>
      <i className="wgsa-button-icon material-icons">file_download</i>
      <span>Downloads</span>
    </button>
    <ul className="wgsa-menu__list mdl-shadow--2dp">
      <li>
        <span className="wgsa-menu-heading">Population Downloads</span>
        <ul className="wgsa-submenu">
          <DownloadMenuItem
            link={treeLinks.population}
            filename={`${Species.nickname}_population_tree.nwk`}
            description="Population Tree (.nwk)"
          />
        </ul>
      </li>
      <li>
        <span className="wgsa-menu-heading">Collection Downloads</span>
        <ul className="wgsa-submenu">
          <DownloadMenuItem
            link={treeLinks.collection}
            filename={`${collectionId}_collection_tree.nwk`}
            description="Collection Tree (.nwk)"
          />
          { Object.keys(files).map(format => {
            const { collection, ...props } = files[format];
            return (
              <li key={format} className="wgsa-menu__item">
                <DownloadButton
                  format={format}
                  idList={collection ? [ collectionId ] : assemblyIds}
                  { ...props }
                />
                { props.description }
              </li>
            );
          })
          }
        </ul>
      </li>
    </ul>
  </div>
);

DownloadsMenu.propTypes = {
  populationTreeLink: React.PropTypes.string,
  collectionTreeLink: React.PropTypes.string,
  collectionId: React.PropTypes.string,
  active: React.PropTypes.bool,
  dispatch: React.PropTypes.func,
};

function mapStateToProps({ downloads, collection, filter }) {
  return {
    collectionId: collection.id,
    assemblyIds: filter.active ? [ ...filter.ids ] : collection.assemblyIds,
    ...downloads,
  };
}

export default connect(mapStateToProps)(DownloadsMenu);
