import * as actions from '../actions';
import { UPLOAD_FETCH_GENOMES } from '../../actions';
import { UPLOAD_ADD_GENOMES } from '../../../actions';

import { statuses } from '../constants';

export default function (state = {}, { type, payload }) {
  switch (type) {
    case UPLOAD_ADD_GENOMES.SUCCESS: {
      const nextState = {};
      for (const genome of payload.genomes) {
        nextState[genome.id] = statuses.PENDING;
      }
      return nextState;
    }

    case UPLOAD_FETCH_GENOMES.SUCCESS: {
      const nextState = { ...state };
      for (const genome of payload.result.genomes) {
        if (!(genome.id in nextState)) {
          nextState[genome.id] = genome.files
            ? statuses.PENDING
            : statuses.SUCCESS;
        }
      }
      return nextState;
    }

    case actions.PROCESS_GENOME.ATTEMPT:
      return {
        ...state,
        [payload.id]: statuses.QUEUED,
      };

    case actions.COMPRESS_GENOME.ATTEMPT:
      return {
        ...state,
        [payload.id]: statuses.COMPRESSING,
      };

    case actions.UPLOAD_GENOME.ATTEMPT:
      return {
        ...state,
        [payload.id]: statuses.UPLOADING,
      };

    case actions.UPLOAD_GENOME.FAILURE:
    case actions.PROCESS_GENOME.FAILURE:
      return {
        ...state,
        [payload.id]: statuses.ERROR,
      };

    case actions.UPLOAD_GENOME.SUCCESS:
    case actions.PROCESS_GENOME.SUCCESS:
      return {
        ...state,
        [payload.id]: statuses.SUCCESS,
      };

    default:
      return state;
  }
}
