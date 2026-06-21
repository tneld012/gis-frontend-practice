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
      layers: [{ id: 'satellite', type: 'raster', source: 'satellite', paint: { 'raster-opacity': 1 } }],
};

const Week3 = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  const [mapType, setMapType] = useState<"raster" | "vector">("raster");
  const [rasterOpacity, setRasterOpacity] = useState(1);

  useEffect(() => {
    if (mapContainerRef.current == null || mapRef.current != null) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: RASTER_STYLE,
      center: [127.0, 37.5],
      zoom: 6,
    });
    mapRef.current = map;

    // TODO: 같은 데이터를 vector 데모(https://demotiles.maplibre.org/style.json)와 비교
    // TODO: (보너스) titiler.xyz 동적 COG 타일을 raster source 로 추가 (README 참고)

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;

    if (map == null) return;
    if (mapType !== "raster") return;

    const updateRasterOpacity = () => {
      map.setPaintProperty("satellite", "raster-opacity", rasterOpacity);
    };

    if (map.isStyleLoaded()) {
      updateRasterOpacity();
    } else {
      map.once("idle", updateRasterOpacity);
    }
  }, [rasterOpacity, mapType]);

  useEffect(() => {
    if (mapRef.current == null) return;

    if (mapType === "raster") {
      mapRef.current.setStyle(RASTER_STYLE);
    }

    if (mapType === "vector") {
      mapRef.current.setStyle("https://demotiles.maplibre.org/style.json");
    }
  }, [mapType]);

  return (
    <>
      <button onClick={() => setMapType("raster")}>위성 지도</button>
      <button onClick={() => setMapType("vector")}>벡터 지도</button>
      <p>현재 지도: {mapType === "raster" ? "위성 지도" : "벡터 지도"}</p>
      {mapType === "raster" && (
        <label>
          위성 투명도: {rasterOpacity}
          <input type="range" min="0" max="1" step="0.1" value={rasterOpacity} onChange={(event) => { setRasterOpacity(Number(event.target.value)); }}/>
        </label>)}
      <div ref={mapContainerRef} className="map-container" />
    </>
  )
};

export default Week3;
