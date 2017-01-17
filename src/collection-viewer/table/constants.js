import React from 'react';

import DownloadButton from '../downloads/DownloadButton.react';
import { FastaFileLink, FastaArchiveButton } from '../../fasta-download';

import { getArchiveDownloadProps } from '../../constants/downloads';

import { defaultWidthGetter } from '../../table/utils/columnWidth';

import { CGPS } from '../../app/constants';
import Species from '../../species';

export const tableKeys = {
  metadata: 'metadata',
  typing: 'typing',
  stats: 'stats',
  antibiotics: 'antibiotics',
  snps: 'snps',
  genes: 'genes',
};

export const dataTables = new Set([
  tableKeys.metadata,
  tableKeys.typing,
  tableKeys.stats,
]);

export const amrTables = new Set([
  tableKeys.antibiotics,
  tableKeys.snps,
  tableKeys.genes,
]);

export const leftSpacerColumn = {
  columnKey: '__spacer_l',
  getHeaderContent() {},
  fixed: true,
  fixedWidth: 1,
  flexGrow: 1,
  getCellContents() {},
};

export const rightSpacerColumn = {
  columnKey: '__spacer_r',
  getHeaderContent() {},
  fixedWidth: 24,
  flexGrow: 1,
  getCellContents() {},
};

export const nameColumnData = {
  columnKey: '__name',
  valueGetter({ name }) {
    return name;
  },
  minWidth: 216,
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

    if (row.__isPublic && row.metadata.collectionId) {
      width += 32;
    }

    if (row.metadata.pmid) {
      width += 32;
    }

    return width;
  },
  getCellContents({ valueGetter }, data) {
    const { metadata } = data;

    return (
      <div className="wgsa-assembly-name-cell">
        {getNameText(data, valueGetter)}
        <div onClick={(e) => e.stopPropagation()}>
          { data.__isPublic && metadata.collectionId ?
            <a className="mdl-button mdl-button--icon"
              href={`/${Species.nickname}/collection/${metadata.collectionId}`}
              title="View WGSA Collection"
              target="_blank" rel="noopener"
            >
              <i className="material-icons">open_in_new</i>
            </a> : null
          }
          { metadata.pmid ?
            <a className="mdl-button mdl-button--icon"
              href={`http://www.ncbi.nlm.nih.gov/pubmed/${metadata.pmid}`}
              target="_blank" rel="noopener"
              title={`PMID ${metadata.pmid}`}
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
