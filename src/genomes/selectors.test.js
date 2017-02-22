import test from 'ava';

import * as selectors from './selectors';

import saureus from '../species/saureus';
import salty from '../species/salty';
const otherSpeciesKey = 'Other';

function getTestState(overrides = {}) {
  return {
    entities: {
      genomes: {
        '123.fa': {
          name: '123.fa',
          speciesId: '1280',
          speciesKey: saureus.name,
          speciesLabel: saureus.formattedShortName,
          country: {
            name: 'United Kingdom',
          },
          uploadAttempted: true,
        },
        '456.fa': {
          name: '456.fa',
          speciesId: '90370',
          speciesKey: salty.name,
          speciesLabel: salty.formattedShortName,
          country: {
            name: 'United States',
          },
          uploadAttempted: true,
        },
        '789.fa': {
          name: '789.fa',
          speciesId: null,
          speciesKey: otherSpeciesKey,
          speciesLabel: otherSpeciesKey,
          uploadAttempted: true,
        },
      },
    },
    hub: {
      filter: overrides.filter || {
        searchText: '',
        speciesKey: null,
        country: null,
      },
    },
  };
}

test('getGenomes', t => {
  const { getGenomes } = selectors;

  const genomes = { '123.fa': {} };

  t.is(getGenomes({ entities: { genomes } }), genomes);
});

test('getOrderedGenomes', t => {
  const { getGenomes, getOrderedGenomes } = selectors;
  const state = getTestState();
  const genomes = getGenomes(state);
  const result = [ genomes['123.fa'], genomes['456.fa'], genomes['789.fa'] ];

  t.deepEqual(getOrderedGenomes(state), result);
});

test('getGenomeKeys', t => {
  const { getGenomeKeys } = selectors;
  const state = getTestState();
  const result = [ '123.fa', '456.fa', '789.fa' ];

  t.deepEqual(getGenomeKeys(state), result);
});

test('getFilter', t => {
  const { getFilter } = selectors;
  const filter = {};
  const state = { hub: { filter } };

  t.is(getFilter(state), filter);
});

test('getGenomeList with inactive filter', t => {
  const { getGenomeList, getOrderedGenomes } = selectors;
  const state = getTestState();
  const result = getOrderedGenomes(state);

  t.deepEqual(getGenomeList(state), result);
});

test('getGenomeList with text filter', t => {
  const { getGenomeList, getGenomes } = selectors;
  const state = getTestState({
    filter: {
      searchText: '123',
    },
  });
  const genomes = getGenomes(state);
  const result = [ genomes['123.fa'] ];

  t.deepEqual(getGenomeList(state), result);
});

test('getGenomeList with species filter', t => {
  const { getGenomeList, getGenomes } = selectors;
  const state = getTestState({
    filter: {
      speciesKey: otherSpeciesKey, // salty.name,
    },
  });
  const genomes = getGenomes(state);
  const result = [ genomes['789.fa'] ];

  t.deepEqual(getGenomeList(state), result);
});

test.todo('getGenomeList with species and id filter');

test('getMetadataFilters', t => {
  const { getMetadataFilters } = selectors;
  const state = getTestState();
  const { wgsaSpecies, otherSpecies, country } = getMetadataFilters(state);

  t.true(wgsaSpecies.length === 2);
  t.true(otherSpecies.length === 1);
  t.true(country.length === 2);
});

test.todo('getMetadataFilters with species filter');
test.todo('getMetadataFilters with country filter');

test('isSupportedSpeciesSelected with species filter', t => {
  const { isSupportedSpeciesSelected } = selectors;
  const state = getTestState({
    filter: {
      speciesKey: saureus.name,
    },
  });

  t.true(isSupportedSpeciesSelected(state));
});

test('isSupportedSpeciesSelected with text filter', t => {
  const { isSupportedSpeciesSelected } = selectors;
  const state = getTestState({
    filter: {
      searchText: '123',
    },
  });

  t.true(isSupportedSpeciesSelected(state));
});

test('isSupportedSpeciesSelected with non-supported species', t => {
  const { isSupportedSpeciesSelected } = selectors;
  const state = getTestState({
    filter: {
      speciesKey: otherSpeciesKey,
    },
  });

  t.false(isSupportedSpeciesSelected(state));
});

test('isSupportedSpeciesSelected with nothing to show', t => {
  const { isSupportedSpeciesSelected } = selectors;
  const state = getTestState({
    filter: {
      searchText: 'x',
    },
  });

  t.false(isSupportedSpeciesSelected(state));
});

test('isFilterActive with no filter', t => {
  const { isFilterActive } = selectors;
  const state = getTestState({
    filter: {
      speciesKey: null,
      searchText: '',
    },
  });

  t.false(isFilterActive(state));
});

test('isFilterActive with speciesKey', t => {
  const { isFilterActive } = selectors;
  const state = getTestState({
    filter: {
      speciesKey: saureus.name,
    },
  });

  t.true(isFilterActive(state));
});

test('isFilterActive with searchText', t => {
  const { isFilterActive } = selectors;
  const state = getTestState({
    filter: {
      searchText: '12',
    },
  });

  t.true(isFilterActive(state));
});
