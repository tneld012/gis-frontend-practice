/**
 * Week 4 — 그리기 + 공간연산 (최종 미니 프로젝트)
 *
 * 목표: 베이스맵 위에 AOI 를 그리고 면적을 계산한다.
 * 미션(./README.md = 미니 프로젝트):
 *  - AOI 그리기 (mapbox-gl-draw 또는 terra-draw — MapLibre 호환 확인할 것)
 *  - 그린 AOI 면적을 km² 로 표시 (Turf area)
 *  - 최소 면적(예: 0.01 km²) 미달 시 경고
 *  - (보너스) AOI 클릭 시 면적 popup
 *
 * 힌트: area 의 단위는 m². km² = m² / 1_000_000.
 *       검증은 draw 의 create/update 이벤트 시점에서.
 */
import { useEffect, useRef, useState } from "react";

import maplibregl from "maplibre-gl";
import type { GeoJSONSource } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import {
  area,
  booleanIntersects,
  booleanPointInPolygon,
  point,
} from "@turf/turf";
import type { Feature, FeatureCollection, Polygon } from "geojson";

import {
  TerraDraw,
  TerraDrawPolygonMode,
  TerraDrawSelectMode,
} from "terra-draw";
import { TerraDrawMapLibreGLAdapter } from "terra-draw-maplibre-gl-adapter";

const MIN_AREA_KM2 = 0.01;
const AOI_STORAGE_KEY = "week4-aoi";

const AOI_SOURCE_ID = "aoi-source";
const AOI_FILL_LAYER_ID = "aoi-fill-layer";
const AOI_OUTLINE_LAYER_ID = "aoi-outline-layer";

const ESRI_SATELLITE_URL =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

const RESTRICTED_AREA: Feature<Polygon> = {
  type: "Feature",
  properties: {},
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [126.9, 37.45],
        [127.15, 37.45],
        [127.15, 37.65],
        [126.9, 37.65],
        [126.9, 37.45],
      ],
    ],
  },
};

type AoiStatus = "valid" | "invalid";

type AoiFeature = Feature<
  Polygon,
  {
    areaKm2: number;
    status: AoiStatus;
  }
>;

const emptyAoiFeatureCollection: FeatureCollection<Polygon> = {
  type: "FeatureCollection",
  features: [],
};

const saveAoi = (feature: AoiFeature) => {
  localStorage.setItem(AOI_STORAGE_KEY, JSON.stringify(feature));
};

const loadAoi = (): AoiFeature | null => {
  const savedAoi = localStorage.getItem(AOI_STORAGE_KEY);

  if (savedAoi == null) return null;

  return JSON.parse(savedAoi) as AoiFeature;
};

const removeAoi = () => {
  localStorage.removeItem(AOI_STORAGE_KEY);
};

const addAoiLayer = (map: maplibregl.Map) => {
  if (map.getSource(AOI_SOURCE_ID) != null) return;

  map.addSource(AOI_SOURCE_ID, {
    type: "geojson",
    data: emptyAoiFeatureCollection,
  });

  map.addLayer({
    id: AOI_FILL_LAYER_ID,
    type: "fill",
    source: AOI_SOURCE_ID,
    paint: {
      "fill-color": [
        "match",
        ["get", "status"],
        "valid",
        "#22c55e",
        "invalid",
        "#ef4444",
        "#999999",
      ],
      "fill-opacity": 0.35,
    },
  });

  map.addLayer({
    id: AOI_OUTLINE_LAYER_ID,
    type: "line",
    source: AOI_SOURCE_ID,
    paint: {
      "line-color": [
        "match",
        ["get", "status"],
        "valid",
        "#16a34a",
        "invalid",
        "#dc2626",
        "#666666",
      ],
      "line-width": 2,
    },
  });
};

const updateAoiSource = (map: maplibregl.Map, feature: AoiFeature | null) => {
  const source = map.getSource(AOI_SOURCE_ID) as GeoJSONSource | undefined;

  if (source == null) return;

  source.setData({
    type: "FeatureCollection",
    features: feature == null ? [] : [feature],
  });
};

const Week4 = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const drawRef = useRef<TerraDraw | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);

  const [areaKm2, setAreaKm2] = useState<number | null>(null);

  const [isIntersectingRestrictedArea, setIsIntersectingRestrictedArea] =
    useState(false);

  const areaKm2Ref = useRef<number | null>(null);
  const aoiFeatureRef = useRef<AoiFeature | null>(null);

  const isClearingDrawRef = useRef(false);

  useEffect(() => {
    if (mapContainerRef.current == null || mapRef.current != null) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          satellite: {
            type: "raster",
            tiles: [ESRI_SATELLITE_URL],
            tileSize: 256,
            attribution: "Esri, Maxar, Earthstar Geographics",
          },
        },
        layers: [{ id: "satellite", type: "raster", source: "satellite" }],
      },
      center: [127.0, 37.5],
      zoom: 6,
    });

    mapRef.current = map;

    map.on("click", (event) => {
      const currentAreaKm2 = areaKm2Ref.current;
      const currentAoi = aoiFeatureRef.current;

      if (currentAreaKm2 == null || currentAoi == null) return;

      const clickedPoint = point([event.lngLat.lng, event.lngLat.lat]);

      if (!booleanPointInPolygon(clickedPoint, currentAoi)) return;

      popupRef.current?.remove();

      popupRef.current = new maplibregl.Popup()
        .setLngLat(event.lngLat)
        .setHTML(
          `
          <div>
            <strong>AOI 면적</strong><br />
            ${currentAreaKm2.toFixed(4)} km²
          </div>
        `,
        )
        .addTo(map);
    });

    map.on("load", () => {
      addAoiLayer(map);

      const draw = new TerraDraw({
        adapter: new TerraDrawMapLibreGLAdapter({
          map,
        }),
        modes: [
          new TerraDrawSelectMode(),
          new TerraDrawPolygonMode({
            styles: {
              fillColor: "#ffffff",
              outlineColor: "#2563eb",
              fillOpacity: 0,
              outlineWidth: 2,
            },
          }),
        ],
      });

      const updateAreaFromFeature = (feature: Feature<Polygon>): AoiFeature => {
        const areaM2 = area(feature);
        const nextAreaKm2 = areaM2 / 1_000_000;

        const nextIsIntersectingRestrictedArea = booleanIntersects(
          feature,
          RESTRICTED_AREA,
        );

        setIsIntersectingRestrictedArea(nextIsIntersectingRestrictedArea);

        const nextAoiFeature: AoiFeature = {
          type: "Feature",
          geometry: feature.geometry,
          properties: {
            areaKm2: nextAreaKm2,
            status: nextAreaKm2 >= MIN_AREA_KM2 ? "valid" : "invalid",
          },
        };

        setAreaKm2(nextAreaKm2);
        areaKm2Ref.current = nextAreaKm2;
        aoiFeatureRef.current = nextAoiFeature;

        updateAoiSource(map, nextAoiFeature);

        return nextAoiFeature;
      };

      const resetAoiState = () => {
        setAreaKm2(null);
        areaKm2Ref.current = null;
        aoiFeatureRef.current = null;
        popupRef.current?.remove();
        popupRef.current = null;
        updateAoiSource(map, null);
        setIsIntersectingRestrictedArea(false);
      };

      const updateAreaFromDraw = () => {
        if (isClearingDrawRef.current) return;

        const snapshot = draw.getSnapshot();

        const polygonFeatures = snapshot.filter(
          (feature) => feature.geometry.type === "Polygon",
        );

        const polygonFeature = polygonFeatures.at(-1) as
          | Feature<Polygon>
          | undefined;

        if (polygonFeature == null) {
          resetAoiState();
          return;
        }

        const nextAoiFeature = updateAreaFromFeature(polygonFeature);
        saveAoi(nextAoiFeature);
      };

      draw.on("change", updateAreaFromDraw);

      draw.on("finish", () => {
        updateAreaFromDraw();

        isClearingDrawRef.current = true;
        draw.clear();
        draw.setMode("select");

        setTimeout(() => {
          isClearingDrawRef.current = false;
        }, 0);
      });

      draw.start();

      const savedAoi = loadAoi();

      if (savedAoi != null) {
        updateAreaFromFeature(savedAoi);
        draw.setMode("select");
      } else {
        draw.setMode("polygon");
      }

      drawRef.current = draw;
    });

    return () => {
      drawRef.current?.stop();
      drawRef.current = null;

      popupRef.current?.remove();
      popupRef.current = null;

      map.remove();
      mapRef.current = null;
    };
  }, []);

  const handleResetAoi = () => {
    const draw = drawRef.current;
    const map = mapRef.current;

    if (draw == null || map == null) return;

    draw.clear();
    draw.setMode("polygon");

    setAreaKm2(null);
    areaKm2Ref.current = null;
    aoiFeatureRef.current = null;

    popupRef.current?.remove();
    popupRef.current = null;

    setIsIntersectingRestrictedArea(false);

    updateAoiSource(map, null);
    removeAoi();
  };

  return (
    <>
      <div ref={mapContainerRef} className="map-container" />

      <div
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          background: "#fff",
          padding: 12,
          borderRadius: 8,
          zIndex: 1,
        }}
      >
        <button type="button" onClick={handleResetAoi}>
          AOI 새로 그리기
        </button>

        {areaKm2 != null && (
          <div style={{ marginTop: 8 }}>
            면적: {areaKm2.toFixed(4)} km²
            {areaKm2 < MIN_AREA_KM2 && (
              <strong style={{ color: "#c00" }}> · 최소 면적 미달</strong>
            )}
            {isIntersectingRestrictedArea && (
              <div style={{ marginTop: 8, color: "#c00", fontWeight: 700 }}>
                제한 구역과 겹칩니다.
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Week4;
