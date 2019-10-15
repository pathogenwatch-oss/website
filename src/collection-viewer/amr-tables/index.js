import { createReducer } from './utils';

import * as antibioticsProps from './antibiotics';
import * as snpsProps from './snps';
import * as genesProps from './genes';
import * as kleborateProps from './kleborate';

export const antibiotics = createReducer(antibioticsProps);
export const snps = createReducer(snpsProps);
export const genes = createReducer(genesProps);
export const kleborateAMR = kleborateProps.createReducer();
