const checksumLength = 40;

export const isNovel = id => id.length === checksumLength;

const sourceUrlMap = {
  "pubmlst": "https://pubmlst.org/",
  "enterobase": "https://enterobase.warwick.ac.uk/",
  "pasteur": "https://bigsdb.pasteur.fr/klebsiella/",
  "ridom": "https://ridom.com/",
  "ng-star 2.0": "https://ngstar.canada.ca/pages/welcome",
  "other": "https://github.com/pathogenwatch-oss/typing-databases/blob/90c13106968f7d2c2b2e499f6d2a31e309004898/schemes.json",
};

const sources = {
  "pubmlst": "PubMLST",
  "enterobase": "Enterobase",
  "pasteur": "Pasteur",
  "ridom": "Ridom",
  "ng-star 2.0": "NG-STAR",
};

export function getSourceUrl(source) {
  const lcSource = source.toLowerCase();
  if (lcSource in sourceUrlMap) {
    return sourceUrlMap[lcSource];
  } else {
    return sourceUrlMap.other; // Fallback to other scheme source
  }
}

export function formatMlstSource(source) {
  const lcSource = source.toLowerCase();
  if (lcSource in sources) {
    return sources[lcSource];
  } else {
    return source;
  }
}

export function formatSchemeName(name) {
  return name.replace(/mlst/ig, 'MLST').replace(/cgmlst/ig, 'cgMLST');
}
