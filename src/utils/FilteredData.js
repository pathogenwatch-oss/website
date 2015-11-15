import { DANGER_COLOUR, CGPS } from '../defaults';

function columnNameIsAntibiotic(columnName) {
  return columnName && columnName.toLowerCase() !== '__assembly';
}

function getColour(assembly) {
  const selectedTableColumnName = FilteredDataStore.getColourTableColumnName();
  let colour = '#ffffff';

  if (!assembly) {
    return colour;
  }

  if (columnNameIsAntibiotic(selectedTableColumnName)) {
    const resistanceProfileResult = assembly.analysis.resistanceProfile[selectedTableColumnName].resistanceResult;

    if (resistanceProfileResult === 'RESISTANT') {
      colour = DANGER_COLOUR;
    } else {
      colour = '#ffffff';
    }
  } else if (ReferenceCollectionStore.contains(assembly.metadata.assemblyId)) {
    colour = '#ffffff';
  } else if (UploadedCollectionStore.contains(assembly.metadata.assemblyId)) {
    colour = CGPS.COLOURS.PURPLE_LIGHT;
  }

  return colour;
}

function getDownloadIdList(format) {
  // if (format === 'score_matrix' ||
  //     format === 'differences_matrix' ||
  //     format === 'kernel_checksum_distribution') {
  //   return [ UploadedCollectionStore.getCollectionId() ];
  // }
  // return FilteredDataStore.getAssemblyIds();
  return [];
}

export default {
  getColour,
  getDownloadIdList,
};
