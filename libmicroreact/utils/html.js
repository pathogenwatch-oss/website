import html2canvas from 'html2canvas';
import { triggerEvent } from './events';

const isUrlFieldRegex = /__url$/i;

export function exportPngUrl(dataUrl, filename = 'image') {
  const anchor = document.createElement('a');
  if (typeof anchor.download !== 'undefined') {
    anchor.download = `microreact-${filename}.png`;
    anchor.href = dataUrl;
    anchor.dataset.downloadurl =
      [ 'image/png', anchor.download, anchor.href ].join(':');
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  } else {
    document.location.href = dataUrl.replace('image/png', 'image/octet-stream');
  }
}

export function exportSvgUrl(svg, filename = 'image') {
  const dataUrl = `data:image/svg+xml;base64,${window.btoa(svg)}`;
  const anchor = document.createElement('a');
  if (typeof anchor.download !== 'undefined') {
    anchor.download = `microreact-${filename}.svg`;
    anchor.href = dataUrl;
    anchor.dataset.downloadurl =
      [ 'image/svg+xml', anchor.download, anchor.href ].join(':');
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  } else {
    document.location.href = dataUrl;
  }
}



function exportHtmlAsExcel(html, filename = 'excel') {
  const dataUrl = `data:application/vnd.ms-excel,${html}`;
  const anchor = document.createElement('a');
  if (typeof anchor.download !== 'undefined') {
    anchor.download = `microreact-${filename}.xls`;
    anchor.href = dataUrl;
    anchor.dataset.downloadurl =
      [ 'application/vnd.ms-excel', anchor.download, anchor.href ].join(':');
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  } else {
    document.location.href = dataUrl;
  }
}

export function exportHtmlElementAsImage(domElement, filename, callback) {
  triggerEvent('toggle-loader', true);
  domElement.classList.add('mr-export-wrapper');
  html2canvas(domElement, {
    useCORS: true,
    onrendered: canvas => {
      domElement.classList.remove('mr-export-wrapper');
      const dataUrl = canvas.toDataURL();
      exportPngUrl(dataUrl, filename);
      if (typeof(callback) === 'function') {
        callback(canvas);
      }
      triggerEvent('toggle-loader', false);
    },
  });
}

export function exportHtmlElementAsExcel(domElement, filename, callback) {
  triggerEvent('toggle-loader', true);
  exportHtmlAsExcel(domElement.outerHTML, filename);
  if (typeof(callback) === 'function') {
    callback();
  }
  triggerEvent('toggle-loader', false);
}

export function isUrlField(field) {
  return isUrlFieldRegex.test(field);
}
