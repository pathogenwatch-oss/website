export const statuses = {
  READY: 'READY',
  PROCESSING: 'PROCESSING',
  NOT_FOUND: 'NOT_FOUND',
  FAILED: 'FAILED',
  ABORTED: 'ABORTED',
};

export const tableKeys = {
  metadata: 'metadata',
  typing: 'typing',
  stats: 'stats',
  antibiotics: 'antibiotics',
  snps: 'snps',
  genes: 'genes',
  kleborateAMR: 'kleborateAMR',
  timeline: 'timeline',
  vista: 'vista',
};

export const tableDisplayNames = {
  [tableKeys.antibiotics]: 'Antibiotics',
  [tableKeys.genes]: 'Genes',
  [tableKeys.kleborateAMR]: 'Kleborate AMR',
  [tableKeys.metadata]: 'Metadata',
  [tableKeys.stats]: 'Stats',
  [tableKeys.snps]: 'SNPs',
  [tableKeys.timeline]: 'Timeline',
  [tableKeys.typing]: 'Typing',
  [tableKeys.vista]: 'Virulence',
};
