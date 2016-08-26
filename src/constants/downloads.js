import { requestDownload } from '../actions/downloads';

import { SERVER_ADDRESS, API_ROOT } from '../utils/Api';

import Species from '../species';

export const encode = encodeURIComponent;
export const collectionPath = () => `${API_ROOT}/species/${Species.id}/download/file`;
export const speciesPath = () => `${SERVER_ADDRESS}/${Species.nickname}/download`;

export function createDownloadKey(id) {
  if (!id) return null;
  return typeof id === 'string' ? id : id.join('|');
}

export function createFilename(formatName, collectionId, assemblyName) {
  return (
    `wgsa_${Species.nickname}_${collectionId}_${formatName}` +
    `${assemblyName ? `_${assemblyName}` : ''}`
  );
}

export function createDownloadProps(params, dispatch) {
  const { format, download, idList, filenameParams, getFileContents } = params;
  const { filename, linksById = {}, ...DownloadProps } = download;

  return {
    format,
    ...DownloadProps,
    ...(linksById[createDownloadKey(idList)] || []),
    onClick: () => dispatch(
      requestDownload({
        format,
        idList,
        getFileContents,
        speciesId: Species.id,
        filename: createFilename(filename, ...filenameParams),
      })
    ),
  };
}

function createPropsForDownloads(downloads, params, dispatch) {
  const { idList, filenameParams } = params;

  return Object.keys(downloads).reduce((memo, format) => ({
    ...memo,
    [format]: createDownloadProps({
      format,
      download: downloads[format],
      idList,
      filenameParams,
    }, dispatch),
  }), {});
}

export function addDownloadProps(row, { collection, downloads }, dispatch) {
  const { assemblyId, assemblyName } = row.metadata;
  return {
    ...row,
    __downloads: createPropsForDownloads(downloads, {
      idList: [ assemblyId ],
      filenameParams: [ collection.id, assemblyName ],
    }, dispatch),
  };
}

export function getArchiveDownloadProps(state, downloads, dispatch) {
  const { filter, collection } = state;
  const idList = Array.from(filter.active ? filter.ids : filter.unfilteredIds);
  return createPropsForDownloads(downloads, {
    idList,
    filenameParams: [ collection.id ],
  }, dispatch);
}

export const speciesDownloads = [
  { // subtitle: () => 'Reference Population',
    items: [
      { text: 'Core Representatives',
        filename: 'core_representatives.csv',
      },
    ],
  },
  { subtitle: () => 'Reference Data',
    items: [
      { text: 'Sequences',
        filename: 'reference_fastas.zip',
      },
      { text: 'Annotations',
        filename: 'reference_annotations.zip',
      },
      { text: 'Metadata',
        filename: 'reference_metadata.csv',
      },
    ],
  },
  // { subtitle: () => 'Antibiotic Resistance',
  //   items: [
  //     { text: 'AMR SNP Sequences',
  //       filename: () => `wgsa_${Species.nickname}_amr_snp_sequences.fa`,
  //       serverName: () => 'ar_snps_lib.fa',
  //     },
  //     { text: 'AMR SNPs',
  //       filename: () => `wgsa_${Species.nickname}_amr_snps.tsv`,
  //       serverName: () => 'ar_snps.tsv',
  //     },
  //     { text: 'Acquired AMR Genes',
  //       filename: () => `wgsa_${Species.nickname}_resistance_genes.csv`,
  //       serverName: () => 'resistance_genes.tsv',
  //     },
  //   ],
  // },
];
