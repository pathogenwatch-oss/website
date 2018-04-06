import { CHANGE_BRANDING } from './actions';

const brandings = [
  'wgsa',
  'pathogenwatch',
  'pathogenDotWatch',
];

function getInitalBranding() {
  return brandings[1];
  // return brandings[Math.floor(Math.random() * 3)];
}

const initialState = {
  id: getInitalBranding(),
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CHANGE_BRANDING:
      return {
        id: action.payload,
      };
    default:
      return state;
  }
}
