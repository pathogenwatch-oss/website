import { createSelector } from 'reselect';

import { isUploading, getUploadedGenomeList, getTotalErrors } from '../uploads/selectors';
import { getGenomeList } from '../selectors';
import { getPrefilter } from '../filter/selectors';

export const getGridItems = createSelector(
  getPrefilter,
  isUploading,
  getTotalErrors,
  getGenomeList,
  getUploadedGenomeList,
  (prefilter, uploading, totalErrors, genomeList, uploadedGenomes) => {
    if (prefilter === 'upload' && (uploading || totalErrors)) {
      return uploadedGenomes;
    }
    return genomeList;
  }
);
