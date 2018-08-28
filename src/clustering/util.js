export const cluster = (threshold, pi, lambda) => {
  const nItems = pi.length;
  const _clusters = pi.map(() => 0);
  for (let i = nItems - 1; i >= 0; i--) {
    if (lambda[i] > threshold) _clusters[i] = i;
    else _clusters[i] = _clusters[pi[i]];
  }
  return _clusters;
};