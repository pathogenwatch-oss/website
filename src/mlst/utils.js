const checksumLength = 40;

export const isNovel = id => id.length === checksumLength;

export function createCode(alleles, novelChar) {
  return (
    alleles.map(({ hits }) =>
      hits.map(hit => (novelChar && isNovel(hit) ? novelChar : hit)).join(',')
    ).join('_')
  );
}
