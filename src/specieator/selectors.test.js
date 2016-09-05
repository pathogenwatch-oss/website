import test from 'ava';

import * as selectors from './selectors';

function getTestState(mods = {}) {
  return {
    entities: {
      fastas: {
        '123.fa': { name: '123.fa', speciesId: '1280' },
        '456.fa': { name: '456.fa', speciesId: '90370' },
      },
    },
    specieator: Object.assign({
      fastaOrder: [ '123.fa', '456.fa' ],
      filter: {
        active: false,
        ids: new Set(),
        speciesId: null,
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

test('getVisibleFastas with id filter', t => {
  const { getVisibleFastas, getFastas } = selectors;
  const state = getTestState({
    fastaOrder: [ '123.fa', '456.fa' ],
    filter: {
      active: true,
      ids: new Set([ '123.fa' ]),
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
      active: true,
      ids: new Set([ '456.fa' ]),
      speciesId: '90370',
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
  const result = [
    { speciesId: '1280', count: 1, active: false },
    { speciesId: '90370', count: 1, active: false },
  ];

  t.deepEqual(getSpeciesSummary(state), result);
});

test('getSpeciesSummary with species filter', t => {
  const { getSpeciesSummary } = selectors;
  const state = getTestState({ filter: { speciesId: '1280' } });
  const result = [
    { speciesId: '1280', count: 1, active: true },
    { speciesId: '90370', count: 1, active: false },
  ];

  t.deepEqual(getSpeciesSummary(state), result);
});
