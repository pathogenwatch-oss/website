import { FETCH_COLLECTION } from '^/collection-viewer/actions';
import { statuses, tableKeys } from '^/collection-viewer/constants';
import { calculateHeaderWidthAlternative, spacerGroup, systemGroup } from '~/collection-viewer/amr-tables/utils';
import { SET_COLOUR_COLUMNS } from '^/collection-viewer/table/actions';
import { measureHeadingText } from '~/collection-viewer/table/columnWidth';
import * as amr from '^/collection-viewer/amr-utils';
import { kleborateCleanElement } from '~/collection-viewer/amr-utils';
import { onHeaderClick } from '^/collection-viewer/amr-tables/thunks';
import React from '^/react-shim';
import {
  formatAMRMatch,
  formatAMRName,
  ignoreFields,
  multiClassFields,
  sortKleborateProfile
} from '~/task-utils/kleborate';

export const name = tableKeys.kleborateAMRGenotypes;

const effectColour = amr.getStateColour('RESISTANT');

export function hasElement({ analysis = {} }, element) {
  if (!analysis.kleborate || !analysis.kleborate.amr) {
    return false;
  }
  for (const phenotype of Object.values(analysis.kleborate.amr.profile)) {
    if (kleborateCleanElement(phenotype.matches).includes(element)) {
      return true;
    }
  }
  return false;
}

function createColumn(key, element, bufferSize) {
  return {
    addState({ genomes }) {
      if (!genomes.length) return this;
      this.width = this.getWidth() + 16;
      return this;
    },
    columnKey: key,
    displayName: element,
    headerTitle: element,
    label: element,
    cellClasses: 'wgsa-table-cell--resistance',
    getWidth() {
      return measureHeadingText(element) + bufferSize;
    },
    getCellContents(props, genome) {
      return hasElement(genome, element) ? (
        <i
          className="material-icons wgsa-resistance-icon"
          style={{ color: effectColour }}
          title={`${formatAMRMatch({ matches: element })} found`}
        >
          lens
        </i>
      ) : null;
    },
    headerClasses: 'wgsa-table-header--expanded',
    valueGetter: genome => (hasElement(genome, element) ? effectColour : amr.nonResistantColour),
    onHeaderClick,
  };
}

function buildColumns(genomes) {
  // Distinct set of resistance determinants and which "classes"
  // they are linked to (a determinant can be in more than one class)
  const elementsInResults = {};

  for (const genome of genomes) {
    if (!genome.analysis.kleborate || !genome.analysis.kleborate.amr) {
      continue;
    }
    const profile = genome.analysis.kleborate.amr.profile;
    for (const phenotype of Object.values(profile)) {
      if (phenotype.key in multiClassFields) {
        if (phenotype.match === '-' && profile[multiClassFields[phenotype.key]] === '-') {
          continue;
        }
      } else if (phenotype.match === '-') {
        continue;
      }
      if (!elementsInResults[phenotype.key]) {
        elementsInResults[phenotype.key] = { key: phenotype.key, name: phenotype.name, elements: new Set() };
      }
      const elements = phenotype.key in multiClassFields ?
        `${phenotype.matches};${profile[multiClassFields[phenotype.key]].matches}`.split(';').filter(element => element !== '-').map(element => kleborateCleanElement(element)) :
        phenotype.matches.split(';').filter(element => element !== '-').map(element => kleborateCleanElement(element));
      elements.forEach(element => {
        elementsInResults[phenotype.key].elements.add(element);
      });
    }
  }

  return Object.values(elementsInResults).sort(sortKleborateProfile()).filter(record => !ignoreFields.has(record.key)).reduce((groups, antibioticRecord) => {
    const {
      fixedWidth,
      bufferSize,
    } = calculateHeaderWidthAlternative(antibioticRecord.name, Array.from(antibioticRecord.elements));
    groups.push({
      group: true,
      columnKey: `kleborateAMRGenotypes_${antibioticRecord.key}`,
      fixedWidth,
      getCellContents() {
      },
      headerClasses: 'wgsa-table-header--expanded',
      label: formatAMRName(antibioticRecord),
      headerTitle: formatAMRName(antibioticRecord),
      onHeaderClick,
      columns: Array.from(antibioticRecord.elements)
        .filter(element => element !== '-')
        .sort()
        .map((element) => createColumn(
          `kleborateAMRGenotypes_${antibioticRecord.name}_${element}`, element, bufferSize
        )),
    });
    return groups;
  }, []);
}

const initialState = {
  activeColumns: new Set(),
  columns: [],
};

export function createReducer() {
  return function (state = initialState, { type, payload }) {
    switch (type) {
      case FETCH_COLLECTION.SUCCESS: {
        const { genomes, status } = payload.result;
        if (status !== statuses.READY || !genomes[0].analysis.kleborate) return state;
        return {
          ...state,
          columns: [ systemGroup, ...(buildColumns(genomes)), spacerGroup ],
        };
      }
      case SET_COLOUR_COLUMNS:
        return {
          ...state,
          activeColumns:
            payload.table === name ?
              payload.columns :
              state.activeColumns,
        };
      default:
        return state;
    }
  };
}
