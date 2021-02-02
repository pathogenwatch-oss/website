export const CHANGE_BRANDING = 'CHANGE_BRANDING';

export function changeBranding(id) {
  return {
    type: CHANGE_BRANDING,
    payload: id,
  };
}
