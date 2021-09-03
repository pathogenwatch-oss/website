import { ASSEMBLY_FILE_EXTENSIONS } from '~/app/constants';

export function getUploadAccepts() {
  const extensions = [
    ...ASSEMBLY_FILE_EXTENSIONS,
    '.gz',
    '.csv',
  ];
  return extensions.join(',');
}

export {
  default as mapCSVsToGenomes,
} from './mapCSVsToGenomes';
