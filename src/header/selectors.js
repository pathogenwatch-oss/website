export const getHeader = ({ header }) => header;

export const isAsideVisible = state => getHeader(state).asideVisible;

export const isAsideDisabled = state => getHeader(state).asideDisabled;
