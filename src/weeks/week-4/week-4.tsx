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
import { useEffect, useRef, useState } from 'react';

import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
// import { area } from '@turf/turf';

const MIN_AREA_KM2 = 0.01;

// Week3 에서 쓴 공개 위성영상 타일 (베이스맵)
const ESRI_SATELLITE_URL =
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

const Week4 = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [areaKm2, setAreaKm2] = useState<number | null>(null);

  useEffect(() => {
    if (mapContainerRef.current == null || mapRef.current != null) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          satellite: {
            type: 'raster',
            tiles: [ESRI_SATELLITE_URL],
            tileSize: 256,
            attribution: 'Esri, Maxar, Earthstar Geographics',
          },
        },
        layers: [{ id: 'satellite', type: 'raster', source: 'satellite' }],
      },
      center: [127.0, 37.5],
      zoom: 6,
    });
    mapRef.current = map;

    // TODO: draw 컨트롤 추가 → create/update 이벤트에서 Turf area 계산 → setAreaKm2(km2)
    void setAreaKm2; // (미션 구현 시 위 TODO 에서 호출하면 이 줄은 지우세요)

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <>
      <div ref={mapContainerRef} className="map-container" />
      {areaKm2 != null && (
        <div style={{ position: 'absolute', top: 12, left: 12, background: '#fff', padding: 12, borderRadius: 8 }}>
          면적: {areaKm2.toFixed(4)} km²
          {areaKm2 < MIN_AREA_KM2 && <strong style={{ color: '#c00' }}> · 최소 면적 미달</strong>}
        </div>
      )}
    </>
  );
};

export default Week4;
