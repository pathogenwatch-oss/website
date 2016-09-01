import MetadataUtils from '../utils/Metadata';

export function getSystemDataColumnProps({ noPopulation, noMLST } = {}) {
  return [
    { columnKey: '__date',
      valueGetter({ metadata }) {
        return MetadataUtils.getFormattedDateString(metadata.date);
      },
    },
  ].
  concat(noPopulation ? [] : [
    { columnKey: '__subtype',
      valueGetter({ populationSubtype }) {
        return populationSubtype;
      },
    },
    { columnKey: '__st',
      valueGetter({ analysis }) {
        return analysis.st;
      },
    },
  ]).
  concat(noMLST ? [] : [
    { columnKey: '__mlst_profile',
      valueGetter({ analysis }) {
        return analysis.mlst;
      },
    },
  ]).
  concat([
    { columnKey: '__core_matches',
      valueGetter({ analysis }) {
        return analysis.core ?
          analysis.core.size :
          null;
      },
    },
    { columnKey: '__%_core_families',
      valueGetter({ analysis }) {
        return analysis.core ?
          analysis.core.percentMatched :
          null;
      },
    },
    { columnKey: '__%_non-core',
      valueGetter({ analysis }) {
        return analysis.core && analysis.core.percentAssemblyMatched ?
          (100 - analysis.core.percentAssemblyMatched).toFixed(1) :
          null;
      },
    },
    { columnKey: '__assembly_length',
      valueGetter({ metadata }) {
        return metadata.metrics ?
          metadata.metrics.totalNumberOfNucleotidesInDnaStrings :
          null;
      },
    },
    { columnKey: '__n50',
      valueGetter({ metadata }) {
        return metadata.metrics ?
          metadata.metrics.contigN50 :
          null;
      },
    },
    { columnKey: '__no._contigs',
      valueGetter({ metadata }) {
        return metadata.metrics ?
          metadata.metrics.totalNumberOfContigs :
          null;
      },
    },
    { columnKey: '__non-ATCG',
      valueGetter({ metadata }) {
        return metadata.metrics ?
          metadata.metrics.totalNumberOfNsInDnaStrings :
          null;
      },
    },
    { columnKey: '__GC_Content',
      valueGetter({ metadata }) {
        return metadata.metrics && metadata.metrics.gcContent ?
          `${metadata.metrics.gcContent}%` :
          null;
      },
    },
  ]);
}

export const getUserDefinedValue =
  (column, { metadata }) => metadata.userDefined[column];
