import test from 'ava';
import td from 'testdouble';

import { promiseToThunk } from '.';

function setup() {
  return { middleware: promiseToThunk(), next: td.function() };
}

test('actions without a payload should be passed to next middleware',
  t => {
    const { middleware, next } = setup();
    const action = { type: 'ACTION' };

    middleware(next)(action);

    td.verify(next(action));
    t.pass();
  }
);

test('actions with non-promise payloads should be passed to next middleware',
  t => {
    const { middleware, next } = setup();
    const action = { type: 'ACTION', payload: {} };

    middleware(next)(action);

    td.verify(next(action));
    t.pass();
  }
);

test('payloads with promises should be converted to thunks',
  t => {
    const { middleware, next } = setup();
    const action = { type: 'ACTION', payload: { promise: Promise.resolve() } };

    middleware(next)(action);

    td.verify(next(td.matchers.not(action)));
    td.verify(next(td.matchers.isA(Function)));
    t.pass();
  }
);

test.todo('check workings of returned thunk');
