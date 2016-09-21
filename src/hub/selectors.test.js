import test from 'ava';

import * as selectors from './selectors';

import saureus from '../species/saureus';
import salty from '../species/salty';
const otherSpeciesKey = 'Other';

function getTestState(overrides = {}) {
  return {
    entities: {
      fastas: {
        '123.fa': {
          name: '123.fa',
          speciesId: '1280',
          speciesKey: saureus.name,
          speciesLabel: saureus.formattedShortName,
          country: {
            name: 'United Kingdom',
          },
        },
        '456.fa': {
          name: '456.fa',
          speciesId: '90370',
          speciesKey: salty.name,
          speciesLabel: salty.formattedShortName,
          country: {
            name: 'United States',
          },
        },
        '789.fa': {
          name: '789.fa',
          speciesId: null,
          speciesKey: otherSpeciesKey,
          speciesLabel: otherSpeciesKey,
        },
      },
    },
    hub: {
      fastaOrder: overrides.fastaOrder || [ '123.fa', '456.fa', '789.fa' ],
      filter: overrides.filter || {
        searchText: '',
        speciesKey: null,
        country: null,
      },
    },
  };
}

test('getFastas', t => {
  const { getFastas } = selectors;

  const fastas = { '123.fa': {} };

  t.is(getFastas({ entities: { fastas } }), fastas);
});

test('getFastaOrder', t => {
  const { getFastaOrder } = selectors;

  const fastaOrder = [];

  t.is(getFastaOrder({ hub: { fastaOrder } }), fastaOrder);
});

test('getOrderedFastas', t => {
  const { getFastas, getOrderedFastas } = selectors;
  const state = getTestState();
  const fastas = getFastas(state);
  const result = [ fastas['123.fa'], fastas['456.fa'], fastas['789.fa'] ];

  t.deepEqual(getOrderedFastas(state), result);
});

test('getFastaKeys', t => {
  const { getFastaKeys } = selectors;
  const state = getTestState();
  const result = [ '123.fa', '456.fa', '789.fa' ];

  t.deepEqual(getFastaKeys(state), result);
});

test('getFilter', t => {
  const { getFilter } = selectors;
  const filter = {};
  const state = { hub: { filter } };

  t.is(getFilter(state), filter);
});

test('getVisibleFastas with inactive filter', t => {
  const { getVisibleFastas, getOrderedFastas } = selectors;
  const state = getTestState();
  const result = getOrderedFastas(state);

  t.deepEqual(getVisibleFastas(state), result);
});

test('getVisibleFastas with text filter', t => {
  const { getVisibleFastas, getFastas } = selectors;
  const state = getTestState({
    filter: {
      searchText: '123',
    },
  });
  const fastas = getFastas(state);
  const result = [ fastas['123.fa'] ];

  t.deepEqual(getVisibleFastas(state), result);
});

test('getVisibleFastas with species filter', t => {
  const { getVisibleFastas, getFastas } = selectors;
  const state = getTestState({
    filter: {
      speciesKey: otherSpeciesKey, // salty.name,
    },
  });
  const fastas = getFastas(state);
  const result = [ fastas['789.fa'] ];

  t.deepEqual(getVisibleFastas(state), result);
});

test.todo('getVisibleFastas with species and id filter');

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
