export const COLLECTION_ADD_PRIVATE_METADATA = 'COLLECTION_ADD_PRIVATE_METADATA';

export function addPrivateMetadata(data) {
  return {
    type: COLLECTION_ADD_PRIVATE_METADATA,
    payload: data,
  };
}
