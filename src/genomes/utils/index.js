export function shouldNotFetch({ prefilter, uploadedAt }) {
  return (prefilter === 'upload' && !uploadedAt);
}
