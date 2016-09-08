import test from 'ava';

import * as selectors from './selectors';

import saureus from '../species/saureus';
import salty from '../species/salty';

function getTestState(mods = {}) {
  return {
    entities: {
      fastas: {
        '123.fa': {
          name: '123.fa',
          speciesId: '1280',
          speciesKey: saureus.name,
          speciesLabel: saureus.formattedShortName,
        },
        '456.fa': {
          name: '456.fa',
          speciesId: '90370',
          speciesKey: salty.name,
          speciesLabel: salty.formattedShortName,
        },
      },
    },
    specieator: Object.assign({
      fastaOrder: [ '123.fa', '456.fa' ],
      filter: {
        searchText: '',
        speciesKey: null,
      },
    }, mods),
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

  t.is(getFastaOrder({ specieator: { fastaOrder } }), fastaOrder);
});

test('getOrderedFastas', t => {
  const { getFastas, getOrderedFastas } = selectors;
  const state = getTestState();
  const fastas = getFastas(state);
  const result = [ fastas['123.fa'], fastas['456.fa'] ];

  t.deepEqual(getOrderedFastas(state), result);
});

test('getFastaKeys', t => {
  const { getFastaKeys } = selectors;
  const state = getTestState();
  const result = [ '123.fa', '456.fa' ];

  t.deepEqual(getFastaKeys(state), result);
});

test('getFilter', t => {
  const { getFilter } = selectors;
  const filter = {};
  const state = { specieator: { filter } };

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
    fastaOrder: [ '123.fa', '456.fa' ],
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
    fastaOrder: [ '123.fa', '456.fa' ],
    filter: {
      speciesKey: salty.name,
    },
  });
  const fastas = getFastas(state);
  const result = [ fastas['456.fa'] ];

  t.deepEqual(getVisibleFastas(state), result);
});

test.todo('getVisibleFastas with species and id filter');

test('getSpeciesSummary', t => {
  const { getSpeciesSummary } = selectors;
  const state = getTestState();
  const [ staph, typhi ] = getSpeciesSummary(state);

  t.true(
    staph.name === saureus.name &&
    staph.count === 1 &&
    staph.active === false
  );

  t.true(
    typhi.name === salty.name &&
    typhi.count === 1 &&
    typhi.active === false
  );
});

test('getSpeciesSummary with species filter', t => {
  const { getSpeciesSummary } = selectors;
  const state = getTestState({ filter: { speciesKey: saureus.name } });
  const [ staph, typhi ] = getSpeciesSummary(state);

  t.true(
    staph.name === saureus.name &&
    staph.count === 1 &&
    staph.active === true
  );

  t.true(
    typhi.name === salty.name &&
    typhi.count === 1 &&
    typhi.active === false
  );
});

test('isSupportedSpeciesSelected', t => {
  const { isSupportedSpeciesSelected } = selectors;
  const state = getTestState({
    fastaOrder: [ '123.fa', '456.fa' ],
    filter: {
      speciesKey: saureus.name,
    },
  });

  t.true(isSupportedSpeciesSelected(state));
});

test('isFilterActive', t => {
  const { isFilterActive } = selectors;
  const state = getTestState({
    filter: {
      speciesKey: null,
      searchText: true,
    },
  });

  t.false(isFilterActive(state));
});
