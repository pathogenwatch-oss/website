const windowURL = window.URL || window.webkitURL;

let exportFunctions = {};

function downloadDataUrl(data, filename, type) {
  let dataUrl = data;
  if (type === 'svg') {
    dataUrl = windowURL.createObjectURL(new Blob([ data ], { type: 'image/svg+xml' }));
  } else if (type === 'nwk') {
    dataUrl = windowURL.createObjectURL(new Blob([ data ], { type: 'text/plain' }));
  }
  const anchor = document.createElement('a');
  if (typeof anchor.download !== 'undefined') {
    anchor.download = `${filename}.${type}`;
    anchor.href = dataUrl;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  } else {
    if (type === 'png') {
      document.location.href = dataUrl.replace('data:image/png', 'image/octet-stream');
    } else {
      document.location.href = dataUrl;
    }
  }
}

export function addExportCallback(key, callback) {
  exportFunctions[key] = callback;
}

export function removeExportCallback(key) {
  exportFunctions[key] = undefined;
}

export function resetExportCallbacks() {
  exportFunctions = {};
}

export function exportFile(key, filename, download = true) {
  if (typeof(exportFunctions[key]) === 'function') {
    return Promise.resolve(filename)
      .then(exportFunctions[key])
      .then(dataUrl => {
        if (download) {
          const [ , type ] = key.split('-');
          downloadDataUrl(dataUrl, filename, type);
        }
        return dataUrl;
      });
  }
  throw new Error(`Invalid export type: ${key}`);
}
