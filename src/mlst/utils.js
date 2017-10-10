const checksumLength = 40;

export const isNovel = id => id.length === checksumLength;

export function createCode(alleles, trimNovel) {
  return (
    alleles.map(({ hits }) =>
      hits.map(hit =>
        (trimNovel && isNovel(hit) ? `(${hit.slice(0, trimNovel)})` : hit)).join(',')
    ).join('_')
  );
}
