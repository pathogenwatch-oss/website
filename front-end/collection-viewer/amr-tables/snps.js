import { formatEffect, getEffectColour } from '~/collection-viewer/amr-utils';


import { measureHeadingText } from '../table/columnWidth';

import { tableKeys } from '../constants';
import * as amr from '~/collection-viewer/amr-utils';
import React from '~/react-shim';
import { modifierKey } from '~/collection-viewer/amr-tables/utils';

const { onHeaderClick } = require('./thunks');

export const name = tableKeys.snps;

function hasVariant(genome, key, gene, variant) {
  const profile = genome.analysis.paarsnp.resistanceProfile
    .find(prof => prof.agent.key === key);
  const foundGene = profile.determinants.variants.find(determinant => determinant.gene === gene && determinant.variant === variant);
  return !!foundGene;
}

function createColumn(amKey, gene, variant, effect) {
  const effectColour = getEffectColour(effect);

  return {
    addState({ genomes }) {
      if (!genomes.length) return this;
      this.width = this.getWidth() + 16;
      this.hidden = genomes.every(({ analysis }) =>
          analysis.paarsnp &&
          'variants' in analysis.paarsnp &&
          analysis.paarsnp.variants.indexOf(`${gene}_${variant}`) === -1
        );
      return this;
    },
    headerTitle: `${modifierKey} + click to select multiple`,
    columnKey: `${gene}_${variant}`,
    displayName: `${gene}_${variant}`,
    label: variant,
    cellClasses: 'wgsa-table-cell--resistance',
    getWidth() {
      return measureHeadingText(variant);
    },

    getCellContents(props, genome) {
      return hasVariant(genome, amKey, gene, variant) ? (
        <i
          className="material-icons wgsa-resistance-icon"
          style={{ color: effectColour }}
          title={ `${gene}_${variant} found` }
        >
          lens
        </i>
      ) : null;
    },
    headerClasses: 'wgsa-table-header--expanded',
    valueGetter: genome => (hasVariant(genome, amKey, gene, variant) ? effectColour : amr.nonResistantColour),
    onHeaderClick,
  };
}

function extractFoundDeterminants(results) {
  const extracted = results.find(result => 'resistanceProfile' in result).resistanceProfile.reduce((memo, antibioticProfile) => {
    memo[antibioticProfile.agent.key] = {};
    return memo;
  }, {});

  results.forEach(({ resistanceProfile }) => {
    resistanceProfile.forEach(({ agent, determinants }) => {
      if ('variants' in determinants && determinants.variants.length !== 0) {
        determinants
          .variants
          .forEach(({ gene, variant, resistanceEffect }) => {
            if (!(gene in extracted[agent.key])) {
              extracted[agent.key][gene] = {};
            }
            extracted[agent.key][gene][variant] = resistanceEffect
          });
      }
    })
  });
  return extracted;
}

export function buildColumns(results) {
  // Extract all variants in data set
  const variants = extractFoundDeterminants(results, 'variants');

  return results[0].resistanceProfile
    .reduce((groups, { agent }) => {
      const { key, name } = agent;

      groups.push({
        group: true,
        columnKey: `snp_${key}`,
        label: name,
        headerClasses: 'wgsa-table-header--expanded',
        headerTitle: `${modifierKey} + click to select multiple`,
        onHeaderClick,
        columns: Object.keys(variants[key])
          .reduce((columns, gene) => {
            return columns.concat({
                cellClasses: 'wgsa-table-cell--resistance',
                columnKey: gene,
                fixedWidth: measureHeadingText(gene) + 16,
                flexGrow: 0,
                getCellContents() {
                },
                getLabel: () => `${gene}_`,
                addState({ genomes }) {
                  if (!genomes.length) return this;
                  this.hidden =
                    Object.keys(variants[key][gene]).every((variant) =>
                      genomes.every(({ analysis }) =>
                        analysis.paarsnp &&
                        'variants' in analysis.paarsnp &&
                        analysis.paarsnp.variants.indexOf(`${gene}_${variant}`) === -1
                      )
                    );
                  return this;
                },
                headerClasses: 'wgsa-table-header--unstyled wgsa-table-header--expanded',
              },
              Object.keys(variants[key][gene]).map(variant => {
                return createColumn(
                  key,
                  gene,
                  variant,
                  variants[key][gene][variant]
                );
              })
            );
          }, [])
      });
      return groups;
    }, []);
}
