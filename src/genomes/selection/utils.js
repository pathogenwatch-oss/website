import config from '../../app/config';

export function getSelectionLimit() {
  const { user, maxCollectionSize } = config;
  if (!maxCollectionSize) return null;

  const { anonymous, loggedIn } = maxCollectionSize;
  return user ? loggedIn : anonymous;
}

export function isOverSelectionLimit(amount) {
  const limit = getSelectionLimit();
  return limit ? amount > limit : false;
}
