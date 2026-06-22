/**
 * Week 3 — 타일 소비하기 (raster / vector / 동적 COG)
 *
 * 프론트엔드는 타일을 "서빙"하지 않고 "소비"합니다.
 * 그래서 이 주차는 직접 서버를 띄우지 않고, 이미 호스팅된 공개 타일을 가져다 씁니다.
 *
 * 미션(./README.md):
 *  - 공개 위성영상(raster) 타일을 베이스맵으로 표시 (시작 코드에 ESRI 예시)
 *  - 같은 화면을 vector 데모와 비교 (확대 깨짐 / 클릭 가능 여부)
 *  - (보너스) titiler.xyz 의 동적 COG 타일을 얹어보기 → "COG + TiTiler" 패턴 체험
 */
import { useEffect, useRef, useState } from 'react';

import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { StyleSpecification } from 'maplibre-gl';

// 공개 위성영상 raster 타일 (API 키 불필요)
const ESRI_SATELLITE_URL =
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

const COG_URL =
  'https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/54/T/WN/2023/8/S2A_54TWN_20230815_0_L2A/TCI.tif';

const TITILER_COG_TILE_URL =
  `http://localhost:8000/cog/tiles/WebMercatorQuad/{z}/{x}/{y}?url=${encodeURIComponent(COG_URL)}`;

type MapType = "raster" | "vector" | "cog";

const MAP_TYPE_LABEL: Record<MapType, string> = {
  raster: "위성 지도",
  vector: "벡터 지도",
  cog: "COG 지도",
};

const COG_BOUNDS: [number, number, number, number] = [
  140.9997,
  42.3563,
  142.3545,
  43.3529,
];

const RASTER_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    satellite: {
      type: 'raster',
      tiles: [ESRI_SATELLITE_URL],
      tileSize: 256,
      attribution: 'Esri, Maxar, Earthstar Geographics',
    },
  },
  layers: [
    {
      id: 'satellite', 
      type: 'raster', 
      source: 'satellite', 
      paint: { 
        'raster-opacity': 1
      }, 
    },
  ],
};

const COG_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    satellite: {
      type: 'raster',
      tiles: [ESRI_SATELLITE_URL],
      tileSize: 256,
      attribution: 'Esri, Maxar, Earthstar Geographics',
    },
    cog: {
      type: 'raster',
      tiles: [TITILER_COG_TILE_URL],
      tileSize: 256,
      bounds: COG_BOUNDS,
      minzoom: 9,
    },
  },
  layers: [
    {
      id: 'satellite',
      type: 'raster',
      source: 'satellite',
      paint: { 'raster-opacity': 1 },
    },
    {
      id: 'cog-layer',
      type: 'raster',
      source: 'cog',
      paint: { 'raster-opacity': 0.85 },
    },
  ],
};

const Week3 = () => {
  // refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const currentStyleTypeRef = useRef<MapType>("raster");

  // state
  const [mapType, setMapType] = useState<MapType>("raster");
  const [rasterOpacity, setRasterOpacity] = useState(1);
  const [cogOpacity, setCogOpacity] = useState(0.85);

  // state를 따라가는 refs
  const rasterOpacityRef = useRef(rasterOpacity);
  const cogOpacityRef = useRef(cogOpacity);

  useEffect(() => {
    if (mapContainerRef.current == null || mapRef.current != null) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: RASTER_STYLE,
      center: [127.0, 37.5],
      zoom: 6,
    });
    mapRef.current = map;

    map.on("click", (event) => {
      const features = map.queryRenderedFeatures(event.point);

      console.log(
        features.map((feature) => ({
          layerId: feature.layer.id,
          geometryType: feature.geometry.type,
          properties: feature.properties,
        })),
      );
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (map == null) return;

    if (currentStyleTypeRef.current === mapType) return;

    if (mapType === "raster") {
      map.setStyle(RASTER_STYLE);
    }

    if (mapType === "vector") {
      map.setStyle("https://demotiles.maplibre.org/style.json");
    }

    if (mapType === "cog") {
      map.setStyle(COG_STYLE);
    }

    currentStyleTypeRef.current = mapType;

    const handleIdle = () => {
      if (map.getLayer("satellite")) {
        map.setPaintProperty("satellite", "raster-opacity", rasterOpacityRef.current);
      }

      if (map.getLayer("cog-layer")) {
        map.setPaintProperty("cog-layer", "raster-opacity", cogOpacityRef.current);
      }

      if (mapType === "cog") {
        map.flyTo({
          center: [141.5, 42.95],
          zoom: 11,
        });
      }
    };

    map.once("idle", handleIdle);

    return () => {
      map.off("idle", handleIdle);
    };
  }, [mapType]);

  useEffect(() => {
    const map = mapRef.current;
    if (map == null) return;

    rasterOpacityRef.current = rasterOpacity;
    cogOpacityRef.current = cogOpacity;

    if (mapType === "raster" && map.getLayer("satellite")) {
      map.setPaintProperty("satellite", "raster-opacity", rasterOpacity);
    }

    if (mapType === "cog" && map.getLayer("cog-layer")) {
      map.setPaintProperty("cog-layer", "raster-opacity", cogOpacity);
    }
  }, [mapType, rasterOpacity, cogOpacity]);

  return (
    <>
      <button type="button" onClick={() => setMapType("raster")}>{MAP_TYPE_LABEL.raster}</button>
      <button type="button" onClick={() => setMapType("vector")}>{MAP_TYPE_LABEL.vector}</button>
      <button type="button" onClick={() => setMapType("cog")}>{MAP_TYPE_LABEL.cog}</button>
      <p>현재 지도: {MAP_TYPE_LABEL[mapType]}</p>
      {mapType === "raster" && (
        <label>
          위성 투명도: {rasterOpacity}
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.1" 
            value={rasterOpacity} 
            onChange={(event) => { 
              setRasterOpacity(Number(event.target.value)); 
            }}
          />
        </label>
      )}
      {mapType === "cog" && (
        <label>
          COG 투명도: {cogOpacity}
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={cogOpacity}
            onChange={(event) => {
              setCogOpacity(Number(event.target.value));
            }}
          />
        </label>
      )}
      <div ref={mapContainerRef} className="map-container" />
    </>
  )
};

export default Week3;
