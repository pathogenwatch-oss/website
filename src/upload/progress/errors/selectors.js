import { createSelector } from 'reselect';

import {
  getNumFailedUploads,
  getNumRemainingUploads,
} from '../files/selectors';
import { getNumAssemblerErrors } from '../assembly/selectors';
import { getBatchSize } from '../genomes/selectors';

const getErrors = ({ upload }) => upload.progress.errors;

export const getNumberOfProblems = createSelector(
  getNumFailedUploads,
  getNumAssemblerErrors,
  (uploadErrors, assemblerErrors) => uploadErrors + assemblerErrors
);

export const shouldShowErrors = createSelector(
  getNumRemainingUploads,
  getNumFailedUploads,
  getBatchSize,
  state => getErrors(state).showing,
  (remaining, failed, total, toggled) => {
    if (total > 0 && remaining === 0 && failed === total) return true;
    return !!toggled;
  }
);
