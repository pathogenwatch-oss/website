import { createAsyncConstants } from '../../actions';

import * as api from '../api';

import * as selectors from './selectors';
import { getSettingValue } from '../instructions/selectors';

import { getAuthToken } from '../../auth/actions';

import { types } from '../constants';
import * as utils from '../utils';
import { processReads } from '../utils/resumable';

export const ADD_GENOMES = createAsyncConstants('ADD_GENOMES');

export function addGenomes(genomes, uploadedAt) {
  return {
    type: ADD_GENOMES,
    payload: {
      genomes,
      uploadedAt,
      promise: api.initialise(genomes, uploadedAt),
    },
  };
}

export const GENOME_UPLOAD_PROGRESS = 'GENOME_UPLOAD_PROGRESS';

export function genomeUploadProgress(id, progress) {
  return {
    type: GENOME_UPLOAD_PROGRESS,
    payload: {
      id,
      progress,
    },
  };
}

export const COMPRESS_GENOME = createAsyncConstants('COMPRESS_GENOME');

export function compressGenome(id, text) {
  return {
    type: COMPRESS_GENOME,
    payload: {
      id,
      promise: utils.compress(text),
    },
  };
}

export const UPLOAD_GENOME = createAsyncConstants('UPLOAD_GENOME');

export function uploadGenome(genome, data) {
  return dispatch => {
    const { id, metadata } = genome;
    const progressFn = percent => dispatch(genomeUploadProgress(id, percent));

    return dispatch({
      type: UPLOAD_GENOME,
      payload: {
        id,
        promise: api.upload(genome, data, progressFn).then(uploadResult => {
          if (metadata) {
            return api
              .update(uploadResult.id, metadata)
              .then(updateResult => ({ ...uploadResult, ...updateResult }));
          }
          return uploadResult;
        }),
      },
    });
  };
}

export const UPDATE_GENOME = createAsyncConstants('UPDATE_GENOME');

export function updateGenome(id, metadata) {
  return {
    type: UPDATE_GENOME,
    payload: {
      id,
      name: metadata.name,
      promise: api.update(id, metadata),
    },
  };
}

function processAssembly(dispatch, getState, genome) {
  return utils
    .validate(genome)
    .then(data => {
      if (getSettingValue(getState(), 'compression')) {
        return dispatch(compressGenome(genome.id, data));
      }
      return data;
    })
    .then(data => dispatch(uploadGenome(genome, data)));
}

export const PROCESS_GENOME = createAsyncConstants('PROCESS_GENOME');

function processGenome(id) {
  return (dispatch, getState) => {
    const state = getState();
    const genome = selectors.getGenome(state, id);
    const uploadedAt = selectors.getUploadedAt(state);
    const token = state.auth.token;
    return dispatch({
      type: PROCESS_GENOME,
      payload: {
        id,
        promise:
          genome.type === types.READS
            ? processReads(genome, token, uploadedAt, dispatch)
            : processAssembly(dispatch, getState, genome),
      },
    }).catch(error => error);
  };
}

const defaultProcessLimit = 1;

export function processFiles() {
  return (dispatch, getState) => {
    const state = getState();
    if (selectors.isUploading(state)) return;

    const isIndividual = getSettingValue(state, 'individual');
    const processLimit = isIndividual ? 1 : defaultProcessLimit;

    dispatch(getAuthToken()).then(() =>
      (function processNext() {
        const { queue, processing } = selectors.getProgress(getState());
        if (queue.length && processing.size < processLimit) {
          dispatch(processGenome(queue[0])).then(() => {
            if (queue.length > processLimit) {
              processNext();
              return;
            }
          });
          processNext();
        }
      }())
    );
  };
}

export const UPLOAD_ANALYSIS_RECEIVED = 'UPLOAD_ANALYSIS_RECEIVED';

export function receiveUploadAnalysis(msg) {
  return {
    type: UPLOAD_ANALYSIS_RECEIVED,
    payload: msg,
  };
}

export const UPLOAD_FETCH_GENOMES = createAsyncConstants(
  'UPLOAD_FETCH_GENOMES'
);

export function fetchGenomes(uploadedAt) {
  return {
    type: UPLOAD_FETCH_GENOMES,
    payload: {
      uploadedAt,
      promise: api.fetchGenomes(uploadedAt),
    },
  };
}

export const UPLOAD_ORGANISM_SELECTED = 'UPLOAD_ORGANISM_SELECTED';

export function selectOrganism(organismId) {
  return {
    type: UPLOAD_ORGANISM_SELECTED,
    payload: {
      organismId,
    },
  };
}

export const UPLOAD_REQUEUE_FILES = 'UPLOAD_REQUEUE_FILES';

function requeue(files) {
  return {
    type: UPLOAD_REQUEUE_FILES,
    payload: {
      files,
    },
  };
}

export function retryAll() {
  return (dispatch, getState) => {
    const state = getState();
    if (selectors.isUploading(state)) return;

    const failedUploads = selectors.getFailedUploads(state);
    if (!failedUploads.length) return;

    dispatch(requeue(failedUploads));
    dispatch(processFiles());
  };
}

export const REMOVE_GENOMES = 'REMOVE_GENOMES';

export function removeGenomes(ids) {
  return {
    type: REMOVE_GENOMES,
    payload: {
      ids,
    },
  };
}

export function removeAll() {
  return (dispatch, getState) => {
    const state = getState();
    if (selectors.isUploading(state)) return;

    const erroredUploads = selectors.getErroredUploads(state);
    if (!erroredUploads.length) return;

    dispatch(removeGenomes(erroredUploads.map(_ => _.id)));
  };
}

export const UPLOAD_FETCH_POSITION = createAsyncConstants(
  'UPLOAD_FETCH_POSITION'
);

export function fetchQueuePosition(uploadedAt) {
  return {
    type: UPLOAD_FETCH_POSITION,
    payload: {
      uploadedAt,
      promise: api.fetchQueuePosition(uploadedAt),
    },
  };
}

export const SET_PROGRESS_VIEW = 'SET_PROGRESS_VIEW';

export function setProgressView(view) {
  return {
    type: SET_PROGRESS_VIEW,
    payload: {
      view,
    },
  };
}
