import { createSelector } from 'reselect';

const getAccount = ({ account }) => account;

export const getActivity = createSelector(
  getAccount,
  ({ entities, activity }) => entities.activity || activity,
);
