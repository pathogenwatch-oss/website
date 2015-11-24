
export const metadata = 'metadata';

export const resistanceProfile = 'resistanceProfile';

export const formatColumnLabel =
  (columnkey) => columnkey.replace(/^__/, '').replace(/_/g, ' ').toUpperCase();
