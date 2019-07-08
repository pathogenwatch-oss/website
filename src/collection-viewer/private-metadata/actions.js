export const VIEWER_ADD_PRIVATE_METADATA = 'VIEWER_ADD_PRIVATE_METADATA';

export function addPrivateMetadata(data) {
  return {
    type: VIEWER_ADD_PRIVATE_METADATA,
    payload: data,
  };
}

export const VIEWER_TOGGLE_ADD_METADATA = 'VIEWER_TOGGLE_ADD_METADATA';

export function toggleAddMetadata() {
  return {
    type: VIEWER_TOGGLE_ADD_METADATA,
  };
}
