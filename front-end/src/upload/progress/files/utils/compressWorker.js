import pako from 'pako';

export function compress(file) {
  return pako.deflate(file);
}
