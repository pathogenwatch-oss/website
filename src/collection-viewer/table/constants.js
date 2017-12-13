import React from 'react';

import GenomeFileLink from '../../downloads/GenomeFileLink.react';
import GenomeArchiveLink from './GenomeArchiveLink.react';
import AnnotationFileLink from './AnnotationFileLink.react';
import AnnotationArchiveLink from './AnnotationArchiveLink.react';

import { formatCollectionFilename } from '../downloads/utils';

import { defaultWidthGetter } from './columnWidth';

import { tableKeys } from '../constants';
import { CGPS } from '../../app/constants';
import Organisms from '../../organisms';

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
  system: true,
  getHeaderContent() {},
  fixed: true,
  fixedWidth: 1,
  flexGrow: 1,
  getCellContents() {},
};

export const rightSpacerColumn = {
  columnKey: '__spacer_r',
  system: true,
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
};

export const downloadColumnProps = {
  columnKey: '__downloads',
  system: true,
  fixed: true,
  headerClasses: 'wgsa-table-cell--skinny',
  getHeaderContent({ archiveDownloads }) {
    const { ids, filenames } = archiveDownloads;
    return (
      <span className="wgsa-table-downloads" onClick={(e) => e.stopPropagation()}>
        <GenomeArchiveLink ids={ids} filename={filenames.genome} />
        <AnnotationArchiveLink ids={ids} filename={filenames.annotation} />
      </span>
    );
  },
  cellClasses: 'wgsa-table-cell--skinny',
  fixedWidth: 68,
  flexGrow: 0,
  getCellContents(_, { id, _id, name }) {
    return (
      <span className="wgsa-table-downloads" onClick={(e) => e.stopPropagation()}>
        <GenomeFileLink id={id || _id} name={name} type="collection" />
        <AnnotationFileLink id={id || _id} name={name} />
      </span>
    );
  },
  addState(state) {
    const { collection, data } = state; // not full state :/
    return {
      ...this,
      archiveDownloads: {
        ids: data.map(_ => _.id || _._id),
        filenames: {
          genome: formatCollectionFilename(collection, 'genomes.zip'),
          annotation: formatCollectionFilename(collection, 'annotations.zip'),
        },
      },
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

    return width;
  },
  getCellContents({ valueGetter }, data) {
    return (
      <div className="wgsa-genome-name-cell">
        {getNameText(data, valueGetter)}
        <div onClick={(e) => e.stopPropagation()}>
          { data.__isPublic && data.collectionId ?
            <a className="mdl-button mdl-button--icon"
              href={`/${Organisms.nickname}/collection/${data.collectionId}`}
              title="View Original Collection"
              target="_blank" rel="noopener"
            >
              <i className="material-icons">open_in_new</i>
            </a> : null
          }
        </div>
      </div>
    );
  },
};
