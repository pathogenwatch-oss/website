import { downloadColumnProps, nameColumnProps } from '../constants/table';

export const systemColumnProps = [
  { ...downloadColumnProps },
  { ...nameColumnProps,
    cellClasses: 'wgsa-table-cell--bordered',
  },
];
