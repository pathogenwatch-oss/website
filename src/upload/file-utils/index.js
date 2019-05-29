import config from '~/app/config';

export function isReadsEligible() {
  return 'assemblerAddress' in config;
}

export {
  default as mapCSVsToGenomes,
} from './mapCSVsToGenomes';
