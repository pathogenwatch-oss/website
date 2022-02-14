import { FETCH_COLLECTION } from '^/collection-viewer/actions';
import { statuses, tableKeys } from '^/collection-viewer/constants';
import { calculateHeaderWidth, spacerGroup, systemGroup } from '^/collection-viewer/amr-tables/utils';
import { SET_COLOUR_COLUMNS } from '^/collection-viewer/table/actions';
import { measureHeadingText } from '^/collection-viewer/table/columnWidth';
import * as amr from '^/collection-viewer/amr-utils';
import { kleborateCleanElement } from '^/collection-viewer/amr-utils';
import { onHeaderClick } from '^/collection-viewer/amr-tables/thunks';
import React from '^/react-shim';
import { formatAMRName, ignoreFields, multiClassFields, sortKleborateProfile } from '~/task-utils/kleborate';

export const name = tableKeys.kleborateAMRGenotypes;

const effectColour = amr.getStateColour('RESISTANT');

export function hasElement(genome, element) {
  for (const phenotype of Object.values(genome.analysis.kleborate.amr.profile)) {
    if (phenotype.matches.replace(/-\d+%/g, '_truncated').includes(element)) {
      return true;
    }
  }
  return false;
}

function createColumn(key, element, name, bufferSize) {
  return {
    addState({ genomes }) {
      if (!genomes.length) return this;
      this.width = this.getWidth() + 16;
      return this;
    },
    columnKey: key,
    displayName: element,
    label: element,
    cellClasses: 'wgsa-table-cell--resistance',
    getWidth() {
      return measureHeadingText(name) + bufferSize;
    },
    getCellContents(props, genome) {
      return hasElement(genome, element) ? (
        <i
          className="material-icons wgsa-resistance-icon"
          style={{ color: effectColour }}
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
  const elementsInResults = {};

  for (const genome of genomes) {
    if (!genome.analysis.kleborate.amr) {
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
        phenotype.matches.split(';').map(element => kleborateCleanElement(element));
      elements.forEach(element => {
        elementsInResults[phenotype.key].elements.add(element);
      });
    }
  }

  return Object.values(elementsInResults).sort(sortKleborateProfile()).filter(record => !ignoreFields.has(record.key)).reduce((groups, antibioticRecord) => {
    const { fixedWidth, bufferSize } = calculateHeaderWidth(antibioticRecord.name, antibioticRecord.elements.size);
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
          `kleborateAMRGenotypes_${antibioticRecord}_${element}`, element, antibioticRecord.name, bufferSize
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
