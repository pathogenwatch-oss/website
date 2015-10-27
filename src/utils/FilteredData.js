import AntibioticsStore from '../stores/AntibioticsStore';
import FilteredDataStore from '../stores/FilteredDataStore';
import ReferenceCollectionStore from '../stores/ReferenceCollectionStore';
import UploadedCollectionStore from '../stores/UploadedCollectionStore';

import { DANGER_COLOUR, CGPS } from '../defaults';

function columnNameIsAntibiotic(columnName) {
  return (Object.keys(AntibioticsStore.get()).indexOf(columnName) > -1);
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
  if (format === 'score_matrix' || format === 'differences_matrix') {
    return [ UploadedCollectionStore.getCollectionId() ];
  }
  return FilteredDataStore.getAssemblyIds();
}

export default {
  getColour,
  getDownloadIdList,
};
