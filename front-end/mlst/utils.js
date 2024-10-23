const checksumLength = 40;

export const isNovel = id => id.length === checksumLength;

export function createCode(alleles, trimNovel) {
  const profile = alleles.map(({ hit }) => {
    if (!!hit && hit !== "") {
      if (!!trimNovel && isNovel(hit)) {
        return hit.slice(0, trimNovel);
      }
      return hit;
    }
    return "?";
    // return !!hit && hit !== "" ? (!!trimNovel && isNovel(hit) ? `(${hit.slice(0, trimNovel)})` : hit) : '?';
  }).join("_");
  return profile;
}
