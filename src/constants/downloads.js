
export function createDownloadKey(id) {
  return typeof id === 'string' ? id : id.join('|');
}
