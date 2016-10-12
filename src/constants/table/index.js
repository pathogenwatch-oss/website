import React from 'react';

import DownloadButton from '^/components/explorer/DownloadButton.react';

import { getArchiveDownloadProps } from '^/constants/downloads';
import { nameColumnData } from './columns';

import { defaultWidthGetter } from '^/utils/table/columnWidth';

import { CGPS } from '^/app/constants';
import Species from '^/species';


export const tableKeys = {
  metadata: 'metadata',
  resistanceProfile: 'resistanceProfile',
};

const collectionStyle = { color: CGPS.COLOURS.PURPLE };

export const downloadColumnProps = {
  columnKey: '__downloads',
  fixed: true,
  headerClasses: 'wgsa-table-cell--skinny',
  getHeaderContent({ archiveDownloads }) {
    return (
      <span className="wgsa-table-downloads" onClick={(e) => e.stopPropagation()}>
        <DownloadButton {...archiveDownloads.fasta} isArchive iconOnly />
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
  fixedWidth: 80,
  flexGrow: 0,
  getCellContents(_, data) {
    const { fasta, wgsa_gff } = data.__downloads;
    return (
      <span className="wgsa-table-downloads" onClick={(e) => e.stopPropagation()}>
        <DownloadButton { ...fasta } label=".fa" iconOnly />
        <DownloadButton
          { ...wgsa_gff }
          label=".gff"
          color={CGPS.COLOURS.GREEN}
          iconOnly
        />
      </span>
    );
  },
  addState({ collection, filter, downloads }, dispatch) {
    return {
      ...this,
      archiveDownloads: getArchiveDownloadProps(
        { collection, filter }, downloads, dispatch
      ),
    };
  },
};

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
  getWidth(columnProps, row) {
    let width = defaultWidthGetter(columnProps, row);

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
