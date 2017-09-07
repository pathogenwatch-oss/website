export function getMarkers({ positionExtractor, genomes, visibleIds, filteredIds, colourGetter }) {
  if (visibleIds.length === 0) return [];

  const markers = new Map();

  for (const genomeId of visibleIds) {
    const genome = genomes[genomeId];
    const position = positionExtractor(genome);
    if (position) {
      const colour = colourGetter(genome);
      const key = position.join('_');
      const marker = markers.get(key) ||
        { position, id: [], slices: new Map(), highlighted: false };
      marker.id.push(genomeId);
      marker.title = marker.id.length;
      marker.slices.set(colour, (marker.slices.get(colour) || 0) + 1);
      marker.highlighted = marker.highlighted || filteredIds.has(genomeId);
      markers.set(key, marker);
    }
  }

  return Array.from(markers.values());
}
