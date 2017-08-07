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
};

export const tableDisplayNames = {
  [tableKeys.metadata]: 'Metadata',
  [tableKeys.typing]: 'Typing',
  [tableKeys.stats]: 'Stats',
  [tableKeys.antibiotics]: 'Antibiotics',
  [tableKeys.snps]: 'SNPs',
  [tableKeys.genes]: 'Genes',
};
