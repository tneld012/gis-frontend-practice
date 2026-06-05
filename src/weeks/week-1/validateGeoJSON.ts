import type { FeatureCollection } from "geojson";

export function validateGeoJSON(fc: FeatureCollection) {
  const geometry = fc.features[0].geometry;

  if (geometry.type !== 'Polygon' ) {
    return {
      featureCount: fc.features.length,
      isRingClosed: false,
      hasEnoughPoints: false,
      isValidCoordinates: false,
      isValid: false,
    };
  }

  let isRingClosed = true;
  let hasEnoughPoints = true;
  let isValidCoordinates = true;

  for (const ring of geometry.coordinates) {
    if (ring.length < 4) {
      hasEnoughPoints = false;
    }

    const first = ring[0];
    const last = ring[ring.length - 1];

    if (first[0] !== last[0] || first[1] !== last[1]) {
      isRingClosed = false;
    }

    for (const point of ring) {
      const lng = point[0];
      const lat = point[1];

      if (
        lng < -180 ||
        lng > 180 ||
        lat < -90 ||
        lat > 90
      ) {
        isValidCoordinates = false;
      } 
    }
  }

  const isValid =
    isRingClosed &&
    hasEnoughPoints &&
    isValidCoordinates;

  return {
    featureCount: fc.features.length,
    isRingClosed,
    hasEnoughPoints,
    isValidCoordinates,
    isValid
  };
}