import { createReducer } from './utils';

import * as antibioticsProps from './antibiotics';
import * as snpsProps from './snps';
import * as genesProps from './genes';
import * as kleborateProps from './kleborateAMR';
import * as kleborateAMRGenotypesProps from './kleborateAMRGenotypes';
import * as sarscov2VariantsProps from './sarscov2Variants';
import * as vistaProps from './vista';

export const antibiotics = createReducer(antibioticsProps);
export const snps = createReducer(snpsProps);
export const genes = createReducer(genesProps);
export const kleborateAMR = kleborateProps.createReducer();
export const kleborateAMRGenotypes = kleborateAMRGenotypesProps.createReducer();
export const sarscov2Variants = sarscov2VariantsProps.createReducer();
export const vista = vistaProps.createReducer();
