import React from 'react';

import FastaFileLink from './FastaFileLink.react';
import FastaArchiveLink from './FastaArchiveLink.react';
import AnnotationFileLink from './AnnotationFileLink.react';
import AnnotationArchiveLink from './AnnotationArchiveLink.react';
import GenomeReportButton from './GenomeReportButton.react';

import { formatCollectionFilename } from '../downloads/utils';
import { getServerPath } from '../../utils/Api';

import { tableKeys } from '../constants';
import { CGPS } from '../../app/constants';

export const dataTables = new Set([
  tableKeys.metadata,
  tableKeys.typing,
  tableKeys.stats,
]);

export const amrTables = new Set([
  tableKeys.antibiotics,
  tableKeys.snps,
  tableKeys.genes,
  tableKeys.kleborateAMR,
  tableKeys.kleborateAMRGenotypes,
  tableKeys.sarscov2Variants,
  tableKeys.vista,
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
  getHeaderContent({ collection, archiveDownloads }) {
    const { ids, filenames } = archiveDownloads;
    const { uuid, isClusterView } = collection;

    if (isClusterView) {
      return (
        <span className="wgsa-table-downloads" onClick={(e) => e.stopPropagation()}>
          <FastaArchiveLink
            url={getServerPath(`/download/genome/fasta?filename=${filenames.genome}`)}
            ids={ids}
          />
        </span>
      );
    }

    return (
      <span className="wgsa-table-downloads" onClick={(e) => e.stopPropagation()}>
        <FastaArchiveLink
          url={getServerPath(`/download/collection/${uuid}/fastas?filename=${filenames.genome}`)}
          ids={ids}
        />
        <AnnotationArchiveLink
          uuid={uuid} ids={ids}
          filename={filenames.annotation}
        />
      </span>
    );
  },
  cellClasses: 'wgsa-table-cell--skinny',
  flexGrow: 0,
  getCellContents({ collection }, { id, _id = id, name }) {
    const { uuid, isClusterView } = collection;
    if (isClusterView) {
      return (
        <span className="wgsa-table-downloads" onClick={(e) => e.stopPropagation()}>
          <FastaFileLink url={getServerPath(`/download/genome/${_id}/fasta`)} name={name} />
        </span>
      );
    }
    return (
      <span className="wgsa-table-downloads" onClick={(e) => e.stopPropagation()}>
        <FastaFileLink url={getServerPath(`/download/collection/${uuid}/fastas?ids=${_id}`)} name={name} />
        <AnnotationFileLink uuid={uuid} id={id || _id} name={name} />
      </span>
    );
  },
  addState({ collection, genomes }) {
    return {
      ...this,
      collection,
      width: collection.isClusterView ? 44 : 68,
      archiveDownloads: {
        ids: genomes.map(_ => _.id || _._id),
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

  if (data.__isReference || data.reference) {
    return (
      <strong>{text}</strong>
    );
  }

  return <span>{text}</span>;
}

export const nameColumnProps = {
  ...nameColumnData,
  fixed: true,
  getCellContents({ valueGetter }, data) {
    return (
      <div onClick={(e) => e.stopPropagation()}>
        <GenomeReportButton
          id={data.id}
          name={data.name}
          text={getNameText(data, valueGetter)}
        />
      </div>
    );
  },
};
