import pako from 'pako';

onmessage = function (event) {
  postMessage(pako.deflate(event.data));
};
