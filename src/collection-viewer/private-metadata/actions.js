export const VIEWER_ADD_PRIVATE_METADATA = 'VIEWER_ADD_PRIVATE_METADATA';

export function addPrivateMetadata(data) {
  return {
    type: VIEWER_ADD_PRIVATE_METADATA,
    payload: data,
  };
}

export const VIEWER_CLEAR_PRIVATE_METADATA = 'VIEWER_CLEAR_PRIVATE_METADATA';

export function clearPrivateMetadata() {
  return {
    type: VIEWER_CLEAR_PRIVATE_METADATA,
  };
}
