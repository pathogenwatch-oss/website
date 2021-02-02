export const getAccount = ({ account }) => account;

export const getActivity = state => getAccount(state).activity;
