import test from 'ava';

import { createAsyncConstants } from '.';

test('createAsyncConstants', t => {
  const action = 'ACTION';
  const { ATTEMPT, SUCCESS, FAILURE } = createAsyncConstants(action);
  t.true(ATTEMPT && ATTEMPT === `${action}::ATTEMPT`);
  t.true(SUCCESS && SUCCESS === `${action}::SUCCESS`);
  t.true(FAILURE && FAILURE === `${action}::FAILURE`);
});
