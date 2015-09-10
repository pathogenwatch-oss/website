import ANTIBIOTICS from '../../static_data/antibiotics.json';

import TableStore from '../stores/TableStore';
import ReferenceCollectionStore from '../stores/ReferenceCollectionStore';
import UploadedCollectionStore from '../stores/UploadedCollectionStore';

import { CGPS } from '../defaults';


const listOfAntibiotics = Object.keys(ANTIBIOTICS);

function columnNameIsAntibiotic(columnName) {
  return (listOfAntibiotics.indexOf(columnName) > -1);
}

function getColour(assembly) {
  const selectedTableColumnName = TableStore.getColourTableColumnName();
  let colour = '#ffffff';

  if (!assembly) {
    return colour;
  }

  if (columnNameIsAntibiotic(selectedTableColumnName)) {
    const resistanceProfileResult = assembly.analysis.resistanceProfile[selectedTableColumnName].resistanceResult;

    if (resistanceProfileResult === 'RESISTANT') {
      colour = '#ff0000';
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

export default {
  getColour,
};
