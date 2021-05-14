import { FETCH_COLLECTION } from '^/collection-viewer/actions';
import { statuses, tableKeys } from '^/collection-viewer/constants';
import { calculateHeaderWidth, spacerGroup, systemGroup } from '^/collection-viewer/amr-tables/utils';
import { SET_COLOUR_COLUMNS } from '^/collection-viewer/table/actions';
import { measureHeadingText } from '^/collection-viewer/table/columnWidth';
import * as amr from '^/collection-viewer/amr-utils';
import { kleborateCleanElement } from '^/collection-viewer/amr-utils';
import { onHeaderClick } from '^/collection-viewer/amr-tables/thunks';
import React from '^/react-shim';

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

function createColumn(key, element, bufferSize) {
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
      return measureHeadingText(element) + bufferSize;
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
    for (const phenotype of Object.values(genome.analysis.kleborate.amr.profile)) {
      if (phenotype.match === '-' || phenotype.key === 'SHVM') {
        continue;
      }
      if (!elementsInResults[phenotype.name]) {
        elementsInResults[phenotype.name] = new Set();
      }
      const elements = phenotype.matches.split(';').map(element => kleborateCleanElement(element));
      elements.forEach(element => {
        elementsInResults[phenotype.name].add(element);
      });
    }
  }

  return Object.keys(elementsInResults).sort().reduce((groups, antibiotic) => {
    const { fixedWidth, bufferSize } = calculateHeaderWidth(antibiotic, elementsInResults[antibiotic].size);
    groups.push({
      group: true,
      columnKey: `kleborateAMRGenotypes_${antibiotic}`,
      fixedWidth,
      getCellContents() {
      },
      headerClasses: 'wgsa-table-header--expanded',
      label: antibiotic,
      headerTitle: antibiotic,
      onHeaderClick,
      columns: Array.from(elementsInResults[antibiotic])
        .filter(element => element !== '-')
        .sort()
        .map((element) => createColumn(
          `kleborateAMRGenotypes_${antibiotic}_${element}`, element, bufferSize
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
