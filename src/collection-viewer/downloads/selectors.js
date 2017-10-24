import { getViewer } from '../../collection-viewer/selectors';

export const isMenuOpen = state =>
  getViewer(state).downloads.menuOpen;

export const getFiles = state =>
  getViewer(state).downloads.files;
