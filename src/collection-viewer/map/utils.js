export function getMarkers({ assemblies, visibleIds, filteredIds, colourGetter }) {
  if (visibleIds.length === 0) return null;

  return Array.from(
    visibleIds.reduce((memo, assemblyId) => {
      const assembly = assemblies[assemblyId];
      const { position = {} } = assembly.metadata;
      if (position.latitude && position.longitude) {
        const colour = colourGetter(assembly);
        const key = `${position.latitude},${position.longitude}`;
        const marker = memo.get(key) ||
          { position, id: [], title: '', slices: new Map(), highlighted: false };
        marker.id.push(assemblyId);
        marker.title = marker.id.length;
        marker.slices.set(colour, (marker.slices.get(colour) || 0) + 1);
        marker.highlighted = marker.highlighted || filteredIds.has(assemblyId);
        memo.set(key, marker);
      }
      return memo;
    }, new Map()).values()
  );
}
