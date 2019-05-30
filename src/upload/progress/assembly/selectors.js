import { createSelector } from 'reselect';

import {
  getNumUploadedTypes,
  getNumUploadedReads,
  getFailedReadsUploads,
  getUploadedGenomes,
} from '../genomes/selectors';

import { DEFAULT } from '~/app/constants';

export const getAssemblyState = ({ upload }) => upload.progress.assembly;
export const getAssemblyLoaded = ({ upload }) => upload.progress.assembly;
export const getAssemblyProgress = state => getAssemblyState(state).status;
export const getSessionLoaded = state => getAssemblyState(state).loaded;
export const getAssemblyTick = state => getAssemblyState(state).tick;
export const getAssemblyPending = state => getAssemblyProgress(state).pending;

const expectedDuration = 1000 * 60 * 30; // 30 minutes
const maxPercent = 99;
const minPercent = 1;

export const getAssemblyChartData = createSelector(
  getNumUploadedTypes,
  getAssemblyProgress,
  getAssemblyTick,
  (
    { reads, assemblies },
    { runningSince = [], failed = 0, complete = 0 },
    time = Date.now()
  ) => {
    if (reads === 0) return null;
    const total = reads + assemblies;
    let sumProgress = 0;
    for (const timestampInSeconds of runningSince) {
      const elapsedTime = time - (timestampInSeconds * 1000);
      sumProgress += (elapsedTime / expectedDuration) * (100 / total);
    }
    const progress = runningSince.length > 0 ? Math.max(Math.min(maxPercent, sumProgress), minPercent) : 0;
    const completePct = ((complete + assemblies) / total) * 100;
    const failedPct = (failed / total) * 100;
    const assemblingPct = progress * ((100 - completePct - failedPct) / 100);
    const remaining = 100 - completePct - failedPct - assemblingPct;

    return {
      label: 'Assembly progress',
      data: [ completePct, failedPct, assemblingPct, remaining ],
      backgroundColor: [
        '#3c7383',
        DEFAULT.DANGER_COLOUR,
        '#ac65a6',
        'rgba(0, 0, 0, .14)',
      ],
      labels: [ 'Assembled', 'Failed', 'Assembling', 'Remaining' ],
      tooltips: [
        `${complete + assemblies} / ${total}, ${completePct.toFixed(1)}%`,
        `${failed} / ${total}`,
        `${runningSince.length} / ${total}, ${progress.toFixed(1)}%`,
        `${total - runningSince.length - failed - complete} / ${total}`,
      ],
      parents: [],
      total: 100,
    };
  }
);

export const isAssemblyInProgress = createSelector(
  getAssemblyProgress,
  ({ runningSince = [] }) => runningSince.length > 0
);

export const getAssemblySummary = createSelector(
  getNumUploadedReads,
  getAssemblyProgress,
  (total, { complete = 0, failed = 0 }) => ({
    total,
    complete,
    failed,
    done: complete + failed,
    pending: total - failed - complete,
  })
);

export const isAssemblyPending = createSelector(
  getAssemblySummary,
  getFailedReadsUploads,
  ({ pending }, numFailed) => pending - numFailed > 0
);

export const getAssemblerErrors = createSelector(
  state => getAssemblyState(state).errors,
  getUploadedGenomes,
  (errors, genomes) => {
    const _errors = [];
    for (const [ id, error ] of Object.entries(errors)) {
      if (id in genomes && !error.includes('quality')) {
        _errors.push({
          name: genomes[id].name,
          message: error,
        });
      }
    }
    return _errors;
  }
);

export const getNumAssemblerErrors = createSelector(
  getAssemblerErrors,
  errors => errors.length,
);
