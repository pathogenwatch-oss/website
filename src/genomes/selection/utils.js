import config from '../../app/config';

export function getSelectionLimit() {
  const { pagination = { max: 2500 } } = config;
  return pagination.max;
}

export function isOverSelectionLimit(amount) {
  const limit = getSelectionLimit();
  return amount > limit;
}
