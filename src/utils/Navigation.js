import UploadStore from '../stores/UploadStore';

import Species from '^/species';

const assemblyNameRegex = /#assembly-(.+)/;

export function navigateToHome() {
  return setHash();
}

function getAssemblyName() {
  const match = assemblyNameRegex.exec(window.location.hash);
  if (match && match.length === 2) {
    return match[1];
  } else {
    return null;
  }
}

export function navigateToAssembly(name) {
  return setHash(`#assembly-${name}`);
}

function setHash(hash = '') {
  if (window.location.pathname !== `/${Species.nickname}/upload`) {
    return console.error('Invalid location path', window.location);
  }
  if (window.location.hash !== hash) {
    window.location.hash = hash;
  }
}

export function bindNavigationEvents(callback) {
  if (window.location.hash) {
    window.location.hash = '';
  }
  window.onhashchange = handleHashChange.bind(null, callback);
  window.onbeforeunload = handleBeforeUnload;
}

export function unbindNavigationEvents() {
  window.onhashchange = null;
  window.onbeforeunload = null;
}

function handleHashChange(callback) {
  const hash = window.location.hash;
  if (!hash || hash === '' || hash === '#') {
    callback();
  } else {
    const assemblyName = getAssemblyName();
    if (assemblyName) {
      if (UploadStore.getAssembly(assemblyName)) {
        callback(assemblyName);
      } else {
        callback();
      }
    }
  }
}

export function handleBeforeUnload() {
  if (UploadStore.getAssembliesCount() > 0) {
    return 'By leaving this page, your collection will be lost.';
  }
}
