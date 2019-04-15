import { createSelector } from 'reselect';

import { getNumUploadedReads } from '../files/selectors';

import { DEFAULT } from '~/app/constants';

export const getAssemblyState = ({ upload }) => upload.progress.assembly;

export const getAssemblyProgress = state => getAssemblyState(state).status;
export const getAssemblyTick = state => getAssemblyState(state).tick;

const expectedDuration = 1000 * 60 * 20; // 20 minutes
const maxPercent = 99;

export const getAssemblyChartData = createSelector(
  getNumUploadedReads,
  getAssemblyProgress,
  getAssemblyTick,
  (
    total,
    { pending = 0, runningSince = [], failed = 0, complete = 0 },
    time = Date.now()
  ) => {
    if (total === 0) return null;
    let sumProgress = 0;
    for (const timestamp of runningSince) {
      const elapsedTime = time - timestamp;
      if (elapsedTime > expectedDuration) sumProgress += maxPercent;
      else sumProgress += (elapsedTime / expectedDuration) * maxPercent;
    }
    const progress = runningSince.length
      ? sumProgress / runningSince.length
      : 0;
    const pendingPct = (pending / total) * 100;
    const completePct = (complete / total) * 100;
    const failedPct = (failed / total) * 100;
    const assemblingPct =
      progress * ((100 - pendingPct - completePct - failedPct) / 100);
    const remaining =
      100 - pendingPct - completePct - failedPct - assemblingPct;

    return {
      label: 'Assembly progress',
      data: [ pendingPct, failedPct, completePct, assemblingPct, remaining ],
      backgroundColor: [
        '#a386bd',
        DEFAULT.DANGER_COLOUR,
        '#3c7383',
        '#AC65A6',
        'rgba(0, 0, 0, .14)',
      ],
      labels: [ 'Queued', 'Failed', 'Assembled', 'Assembling', 'Remaining' ],
      tooltips: [
        `${pending} / ${total}`,
        `${failed} / ${total}`,
        `${complete} / ${total}, ${completePct.toFixed(1)}%`,
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
    done: complete,
    pending: total - failed - complete,
  })
);

export const isAssemblyComplete = createSelector(
  getAssemblySummary,
  ({ total, done }) => total === done
);
