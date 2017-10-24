import { getViewer } from '../selectors';

export const getStatus = state => getViewer(state).offline.status;
