import { combineReducers } from 'redux';

import * as actions from '../actions';
import { UPLOAD_FETCH_GENOMES } from '../../actions';
import { UPLOAD_ADD_GENOMES } from '../../../actions';

import { types } from '../constants';

import entities from './entities';
import status from './status';
import errors from './errors';

const initialState = {
  batchSize: 0,
  numberOfReads: 0,
  processing: new Set(),
  queue: [],
};

function _(state = initialState, { type, payload }) {
  switch (type) {
    case UPLOAD_ADD_GENOMES.SUCCESS: {
      let numberOfReads = 0;
      const queue = [];
      for (const genome of payload.genomes) {
        if (genome.type === types.READS) numberOfReads++;
        queue.push(genome.id);
      }
      return {
        ...initialState,
        queue,
        numberOfReads,
        batchSize: payload.genomes.length,
      };
    }

    case UPLOAD_FETCH_GENOMES.SUCCESS: {
      let numberOfReads = 0;
      for (const genome of payload.result.genomes) {
        if (genome.type === types.READS) numberOfReads++;
      }
      return {
        ...state,
        numberOfReads,
        batchSize: payload.result.genomes.length,
      };
    }

    case actions.PROCESS_GENOME.ATTEMPT:
      return {
        ...state,
        queue: state.queue.slice(1),
        processing: new Set([ ...state.processing, payload.id ]),
      };

    case actions.PROCESS_GENOME.SUCCESS:
    case actions.PROCESS_GENOME.FAILURE: {
      const processing = new Set(state.processing);
      processing.delete(payload.id);
      return {
        ...state,
        processing,
      };
    }

    default:
      return state;
  }
}

export default combineReducers({
  _,
  entities,
  status,
  errors,
});
