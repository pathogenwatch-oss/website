import test from 'ava';
import td from 'testdouble';

import { promiseToThunk } from '.';
import { createAsyncConstants } from '../actions';

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


function setupThunk(payload) {
  const { middleware, next } = setup();
  const type = createAsyncConstants('ACTION');
  const captor = td.matchers.captor();

  middleware(next)({ type, payload });

  td.verify(next(captor.capture()));

  return { thunk: captor.value, type };
}

test('converted thunk should fire actions for resolved promises and pass props',
  async t => {
    const props = { foo: 'bar' };
    const result = 'result';
    const payload = { promise: Promise.resolve(result), ...props };
    const { type, thunk } = setupThunk(payload);
    const dispatch = td.function();

    thunk(dispatch);

    await payload.promise;

    td.verify(dispatch({ type: type.ATTEMPT, payload: props }));
    td.verify(dispatch({ type: type.SUCCESS, payload: { result, ...props } }));
    t.pass();
  }
);

test('converted thunk should fire actions for rejected promises and pass props',
  async t => {
    const props = { foo: 'bar' };
    const payload = { promise: Promise.reject('error'), ...props };
    const { type, thunk } = setupThunk(payload);
    const dispatch = td.function();

    thunk(dispatch);

    try {
      await payload.promise;
    } catch (error) {
      td.verify(dispatch({ type: type.ATTEMPT, payload: props }));
      td.verify(dispatch({ type: type.FAILURE, payload: { error, ...props } }));
      t.pass();
    }
  }
);
