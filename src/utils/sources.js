module.exports = function getSource(url) {
  if (/pubmlst\.org/.test(url)) return 'PubMLST';
  if (/pasteur\.fr/.test(url)) return 'Pasteur';
  if (/warwick\.ac\.uk/.test(url)) return 'EnteroBase';
  return url;
};
