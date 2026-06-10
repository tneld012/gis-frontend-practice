import type { FeatureCollection, Feature, Polygon } from "geojson";

function isPolygonFeature(feature: Feature): feature is Feature<Polygon> {
  return feature.geometry.type === "Polygon";
}

export function validateGeoJSON(fc: FeatureCollection) {
  const polygonFeatures = fc.features.filter(isPolygonFeature);

  const hasPolygon = polygonFeatures.length > 0;

  const isRingClosed = polygonFeatures.every((feature) =>
    feature.geometry.coordinates.every((ring) => {
      const first = ring[0];
      const last = ring[ring.length - 1];

      return first[0] === last[0] && first[1] === last[1];
    }),
  );

  const hasEnoughPoints = polygonFeatures.every((feature) =>
    feature.geometry.coordinates.every((ring) => ring.length >= 4),
  );

  const isValidCoordinates = polygonFeatures.every((feature) =>
    feature.geometry.coordinates.every((ring) =>
      ring.every((point) => {
        const lng = point[0];
        const lat = point[1];

        return lng >= -180 && lng <= 180 && lat >= -90 && lat < 90;
      }),
    ),
  );

  const isValid =
    hasPolygon && isRingClosed && hasEnoughPoints && isValidCoordinates;

  return {
    featureCount: fc.features.length,
    polygonCount: polygonFeatures.length,
    hasPolygon,
    isRingClosed,
    hasEnoughPoints,
    isValidCoordinates,
    isValid,
  };
}
