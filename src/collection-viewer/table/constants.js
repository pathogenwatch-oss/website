import React from 'react';

import DownloadButton from '../downloads/DownloadButton.react';
import { FastaFileLink, FastaArchiveButton } from '../fasta-download';

import { getArchiveDownloadProps } from '../downloads/utils';

import { defaultWidthGetter } from '../../table/utils/columnWidth';

import { CGPS } from '../../app/constants';
import Species from '../../species';

export const tableKeys = {
  metadata: 'metadata',
  resistanceProfile: 'resistanceProfile',
};

export const views = {
  [tableKeys.resistanceProfile]: [ 'Antibiotics', 'SNPs', 'Genes' ],
};

export const nameColumnData = {
  columnKey: '__name',
  valueGetter({ name }) {
    return name;
  },
};

export const downloadColumnProps = {
  columnKey: '__downloads',
  fixed: true,
  headerClasses: 'wgsa-table-cell--skinny',
  getHeaderContent({ archiveDownloads }) {
    return (
      <span className="wgsa-table-downloads" onClick={(e) => e.stopPropagation()}>
        <FastaArchiveButton />
        <DownloadButton
          {...archiveDownloads.wgsa_gff}
          isArchive
          color={CGPS.COLOURS.GREEN}
          iconOnly
        />
      </span>
    );
  },
  cellClasses: 'wgsa-table-cell--skinny',
  fixedWidth: 68,
  flexGrow: 0,
  getCellContents(_, { __downloads, id, name }) {
    return (
      <span className="wgsa-table-downloads" onClick={(e) => e.stopPropagation()}>
        <FastaFileLink id={id} name={name} />
        <DownloadButton
          { ...__downloads.wgsa_gff }
          label=".gff"
          color={CGPS.COLOURS.GREEN}
          iconOnly
        />
      </span>
    );
  },
  addState({ downloads, ...state }, dispatch) {
    return {
      ...this,
      archiveDownloads: getArchiveDownloadProps(state, downloads, dispatch),
    };
  },
};

const collectionStyle = { color: CGPS.COLOURS.PURPLE };

function getNameText(data, valueGetter) {
  const text = valueGetter(data);

  if (data.__isCollection) {
    return (
      <strong style={collectionStyle}>{text}</strong>
    );
  }

  if (data.__isReference) {
    return (
      <strong>{text}</strong>
    );
  }

  return <span>{text}</span>;
}

export const nameColumnProps = {
  ...nameColumnData,
  fixed: true,
  getWidth(row, props) {
    let width = defaultWidthGetter(row, props, true);

    if (row.__isPublic && row.collectionId) {
      width += 32;
    }

    if (row.pmid) {
      width += 32;
    }

    return width;
  },
  getCellContents({ valueGetter }, data) {
    return (
      <div className="wgsa-assembly-name-cell">
        {getNameText(data, valueGetter)}
        <div onClick={(e) => e.stopPropagation()}>
          { data.__isPublic && data.collectionId ?
            <a className="mdl-button mdl-button--icon"
              href={`/${Species.nickname}/collection/${data.collectionId}`}
              title="View WGSA Collection"
              target="_blank" rel="noopener"
            >
              <i className="material-icons">open_in_new</i>
            </a> : null
          }
          { data.pmid ?
            <a className="mdl-button mdl-button--icon"
              href={`http://www.ncbi.nlm.nih.gov/pubmed/${data.pmid}`}
              target="_blank" rel="noopener"
              title={`PMID ${data.pmid}`}
              style={{ color: '#369' }}
            >
              <i className="material-icons">open_in_new</i>
            </a> : null
          }
        </div>
      </div>
    );
  },
};
