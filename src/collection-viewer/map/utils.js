export function getMarkers({ positionExtractor, genomes, visibleIds, filteredIds, colourGetter }) {
  if (visibleIds.length === 0) return null;

  return Array.from(
    visibleIds.reduce((memo, genomeId) => {
      const genome = genomes[genomeId];
      const position = positionExtractor(genome);
      if (position) {
        const colour = colourGetter(genome);
        const key = position.join('_');
        const marker = memo.get(key) ||
          { position, id: [], slices: new Map(), highlighted: false };
        marker.id.push(genomeId);
        marker.title = marker.id.length;
        marker.slices.set(colour, (marker.slices.get(colour) || 0) + 1);
        marker.highlighted = marker.highlighted || filteredIds.has(genomeId);
        memo.set(key, marker);
      }
      return memo;
    }, new Map()).values()
  );
}
