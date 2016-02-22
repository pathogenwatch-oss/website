import React from 'react';

import DownloadButton from '../components/explorer/DownloadButton.react';

import { getArchiveDownloadProps } from '../constants/downloads';
import { CGPS } from '^/defaults';
import Species from '^/species';


export const tableKeys = {
  metadata: 'metadata',
  resistanceProfile: 'resistanceProfile',
};

export const getCellContents = ({ valueGetter },  data) => valueGetter(data);

const collectionStyle = { color: CGPS.COLOURS.PURPLE };

export const downloadColumnProps = [
  {
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
  },
];

export const nameColumnProps = {
  columnKey: '__name',
  fixed: true,
  valueGetter({ metadata }) {
    return metadata.assemblyName;
  },
  getWidth(columnProps, row) {
    const textWidth = defaultWidthGetter(columnProps, row);

    if (row.__isCollection || row.__isReference || !row.metadata.collectionId) {
      return textWidth;
    }

    return textWidth + 8 + 32; // extra space for collection link
  },
  getCellContents({ valueGetter }, data) {
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

    if (data.metadata.collectionId) {
      return (
        <div className="wgsa-public-collection-link" onClick={(e) => e.stopPropagation()}>
          <span>{text}</span>
          <a className="mdl-button mdl-button--icon"
            target="_blank"
            title="View Original Collection"
            href={`/${Species.nickname}/collection/${data.metadata.collectionId}`}
          >
            <i className="material-icons">open_in_new</i>
          </a>
        </div>
      );
    }

    return text;
  },
};


export const formatColumnLabel =
  (columnkey) => columnkey.replace(/^__/, '').replace(/_/g, ' ').toUpperCase();


export function sortAssemblies(assemblies, id1, id2) {
  const assembly1 = assemblies[id1];
  const assembly2 = assemblies[id2];

  if (assembly1.metadata.assemblyName < assembly2.metadata.assemblyName) {
    return -1;
  }

  if (assembly1.metadata.assemblyName > assembly2.metadata.assemblyName) {
    return 1;
  }

  return 0;
}


const canvas = document.createElement('canvas').getContext('2d');

const cellPadding = 40;

const getFontString =
  (weight = 'normal') => `${weight} 13px "Helvetica","Arial",sans-serif`;

function measureText(text) {
  return canvas.measureText(text).width + cellPadding;
}

export function defaultWidthGetter({ valueGetter }, row) {
  return measureText(valueGetter(row) || '');
}

export function addColumnWidth(column, data) {
  if (column.fixedWidth) {
    return column;
  }

  const { columnKey, getWidth = defaultWidthGetter } = column;
  canvas.font = getFontString();
  const columnLabelWidth = measureText(formatColumnLabel(columnKey));

  column.width = data.length ? data.reduce((maxWidth, row) => {
    const weight = row.__isCollection || row.__isReference ? 'bold' : 'normal';
    canvas.font = getFontString(weight);
    return Math.max(
      maxWidth,
      columnLabelWidth,
      getWidth(column, row),
    );
  }, 0) : columnLabelWidth;

  return column;
}
