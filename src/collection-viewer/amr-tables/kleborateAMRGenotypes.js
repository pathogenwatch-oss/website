import { FETCH_COLLECTION } from '^/collection-viewer/actions';
import { statuses, tableKeys } from '^/collection-viewer/constants';
import Organism from '^/organisms/config';
import { spacerGroup, systemGroup } from '^/collection-viewer/amr-tables/utils';
import { SET_COLOUR_COLUMNS } from '^/collection-viewer/table/actions';
import { measureHeadingText } from '^/collection-viewer/table/columnWidth';
import * as amr from '^/collection-viewer/amr-utils';
import { onHeaderClick } from '^/collection-viewer/amr-tables/thunks';
import React from '^/react-shim';
import { kleborateCleanElement } from '^/collection-viewer/amr-utils';

const isMac =
  (navigator && navigator.platform &&
    navigator.platform.toUpperCase().indexOf('MAC') >= 0);
const modifierKey = isMac ? 'Cmd' : 'Ctrl';

export const name = tableKeys.kleborateAMRGenotypes;

export function hasElement(profiles, genome, element) {
  return profiles[genome.id].has(element);
}


const effect = 'RESISTANT';
const effectColour = amr.getEffectColour(effect);

function createAdvancedViewColumn(key, element, profiles, bufferSize) {
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
      return hasElement(profiles, genome, element) ? (
        <i
          className="material-icons wgsa-resistance-icon"
          style={{ color: effectColour }}
        >
          lens
        </i>
      ) : null;
    },
    headerClasses: 'wgsa-table-header--expanded',
    valueGetter: genome => (hasElement(profiles, genome, element) ? effectColour : amr.nonResistantColour),
    onHeaderClick,
  };
}
function calculateHeaderWidth(label, numChildren) {
  const minWidth = measureHeadingText(label) + 16;
  const childWidth = numChildren * 16;
  return minWidth < childWidth ?
    { fixedWidth: childWidth, bufferSize: 0 } :
    { fixedWidth: minWidth, bufferSize: (minWidth - childWidth) / numChildren };
}

function buildColumns(genomes) {
  const elementsInResults = {};
  const genomeMap = {};
  for (const genome of genomes) {
    if (!genome.analysis.kleborate.amr) {
      continue;
    }
    genomeMap[genome.id] = new Set();
    for (const phenotype of Object.values(genome.analysis.kleborate.amr.profile)) {
      if (phenotype.match === '-') {
        continue;
      }
      if (!elementsInResults[phenotype.name]) {
        elementsInResults[phenotype.name] = new Set();
      }
      const elements = phenotype.matches.split(';').map(element => kleborateCleanElement(element));
      elements.forEach(element => { genomeMap[genome.id].add(element); elementsInResults[phenotype.name].add(element); });
    }
  }
  return Object.keys(elementsInResults).sort().reduce((groups, antibiotic) => {
    const { fixedWidth, bufferSize } = calculateHeaderWidth(antibiotic, elementsInResults[antibiotic].size);
    groups.push({
      group: true,
      columnKey: `kleborateAMRGenotypes_${antibiotic}`,
      fixedWidth,
      getCellContents() {},
      headerClasses: 'wgsa-table-header--expanded',
      label: antibiotic,
      headerTitle: antibiotic,
      onHeaderClick,
      columns: Array.from(elementsInResults[antibiotic])
        .filter(element => element !== '-')
        .sort()
        .map((element) => createAdvancedViewColumn(
          `kleborateAMRGenotypes_${antibiotic}_${element}`, element, genomeMap, bufferSize
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
        const { genomes, status, isClusterView } = payload.result;
        if (status !== statuses.READY || isClusterView || !Organism.uiOptions.kleborate) return state;
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
