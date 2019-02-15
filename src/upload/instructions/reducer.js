import { UPLOAD_SETTING_CHANGED } from './actions';

const initialState = {
  compression: false,
  individual: false,
  loading: false,
  assemblyService: null,
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case UPLOAD_SETTING_CHANGED: {
      return {
        ...state,
        [payload.setting]: payload.value,
      };
    }
    case 'FETCH_ASSEMBLY_LIMITS::ATTEMPT':
      return {
        ...state,
        loading: true,
      };
    case 'FETCH_ASSEMBLY_LIMITS::SUCCESS':
      return {
        ...state,
        loading: false,
        assemblyService: payload.result,
      };
    default:
      return state;
  }
}
