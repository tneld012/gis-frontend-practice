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
import { useEffect, useRef } from 'react';

import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// 공개 위성영상 raster 타일 (API 키 불필요)
const ESRI_SATELLITE_URL =
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

const Week3 = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

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

    // TODO: 같은 데이터를 vector 데모(https://demotiles.maplibre.org/style.json)와 비교
    // TODO: (보너스) titiler.xyz 동적 COG 타일을 raster source 로 추가 (README 참고)

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return <div ref={mapContainerRef} className="map-container" />;
};

export default Week3;
