import { measureHeadingText } from '~/collection-viewer/table/columnWidth';
import { tableKeys } from '../constants';
import * as amr from '~/collection-viewer/amr-utils';
import { formatEffect, getEffectColour } from '~/collection-viewer/amr-utils';
import React from '~/react-shim';
import { calculateHeaderWidth, modifierKey } from '~/collection-viewer/amr-tables/utils';

const { onHeaderClick } = require('./thunks');

export const name = tableKeys.genes;

function hasGene(genome, key, gene) {
  const profile = genome.analysis.paarsnp.resistanceProfile
    .find(prof => prof.agent.key === key);
  const found = profile.determinants.acquired.find(determinant => determinant.gene === gene)
  return !!found;
}

function extractFoundDeterminants(results) {
  const extracted = results.find(result => 'resistanceProfile' in result).resistanceProfile.reduce((memo, antibioticProfile) => {
    memo[antibioticProfile.agent.key] = {};
    return memo;
  }, {});

  results.forEach(({ resistanceProfile }) =>
    resistanceProfile.forEach(({ agent, determinants }) => {
      if ('acquired' in determinants && determinants.acquired.length !== 0) {
        determinants.acquired.forEach(({ gene, resistanceEffect }) => {
          extracted[agent.key][gene] = resistanceEffect;
        });
      }
    }));
  return extracted;
}

function createColumn(key, gene, effect, bufferSize) {
  const effectColour = getEffectColour(effect);
  return {
    addState({ genomes }) {
      if (!genomes.length) return this;
      this.width = this.getWidth() + 16;
      return this;
    },
    columnKey: `${gene}`,
    displayName: gene,
    headerTitle: `${modifierKey} + click to select multiple`,
    label: gene,
    cellClasses: 'wgsa-table-cell--resistance',
    getWidth() {
      return measureHeadingText(gene) + bufferSize;
    },
    getCellContents(props, genome) {
      return hasGene(genome, key, gene) ? (
        <i
          className="material-icons wgsa-resistance-icon"
          style={{ color: effectColour }}
          title={`${gene} found`}
        >
          lens
        </i>
      ) : null;
    },
    headerClasses: 'wgsa-table-header--expanded',
    valueGetter: genome => (
      hasGene(genome, key, gene) ?
        effectColour :
        amr.nonResistantColour
    ),
    onHeaderClick,
  };
}

// export function buildColumns({ paar = {}, antibiotics }, profiles) {
export function buildColumns(results) {
  // First extract all the acquired genes in the dataset
  const acquired = extractFoundDeterminants(results);

  return results[0]
    .resistanceProfile
    .filter(antibioticProfile => Object.keys(acquired[antibioticProfile.agent.key]).length !== 0)
    .reduce((groups, antibioticProfile) => {
      const { key, name } = antibioticProfile.agent;
      const { fixedWidth, bufferSize } = calculateHeaderWidth(name, Object.keys(acquired[key]).length);

      groups.push({
        group: true,
        columnKey: `paar_${key}`,
        fixedWidth,
        headerClasses: 'wgsa-table-header--expanded',
        headerTitle: `${modifierKey} + click to select multiple`,
        label: name,
        onHeaderClick,
        columns: Object.keys(acquired[key])
          .sort()
          .map(gene => createColumn(
            key, gene, acquired[key][gene], bufferSize
          )),
      });

      return groups;
    }, []);
}
