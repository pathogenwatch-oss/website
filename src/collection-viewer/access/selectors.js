import { getCollection } from '../selectors';

export const getAccessLevel = state => getCollection(state).access;
export const getAccessStatus = state => getCollection(state).access_status;
