
export const BODY_CLICK = 'BODY_CLICK';

export function clicked(event) {
  return {
    type: BODY_CLICK,
    event,
  };
}
