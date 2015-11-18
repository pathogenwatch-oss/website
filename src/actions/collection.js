
export const SET_COLLECTION_ID = 'SET_COLLECTION_ID';

export function setCollectionId(id) {
  return {
    type: SET_COLLECTION_ID,
    id,
  };
}
