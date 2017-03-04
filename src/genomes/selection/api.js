import { fetchJson } from '../../utils/Api';

export function downloadGenomes(genomes) {
  fetchJson('PUT', '/download/genome-archive', {
    type: 'genome',
    ids: genomes.map(_ => _.id),
  });
}
