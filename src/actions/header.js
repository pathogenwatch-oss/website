
export const UPDATE_HEADER = 'UPDATE_HEADER';

export function updateHeader(update) {
  return {
    type: UPDATE_HEADER,
    update,
  };
}
