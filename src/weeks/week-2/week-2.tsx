/**
 * Week 2 — MapLibre 기초 + React 통합
 *
 * 목표: 지도를 React 컴포넌트로 안전하게 띄우고 조작한다.
 * 미션(./README.md):
 *  - Week1 GeoJSON 을 source/layer 로 표시
 *  - 폴리곤 클릭 시 properties 를 popup 으로 표시
 *  - "내 동네로 이동" 버튼 (flyTo 또는 fitBounds)
 *
 * 합격 기준: 부모 리렌더에도 지도가 다시 안 깨짐 / 클릭 feature 정확 / 인스턴스를 ref 로 관리
 */
import { useEffect, useRef } from 'react';

import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const Week2 = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (mapContainerRef.current == null || mapRef.current != null) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [127.0, 37.5],
      zoom: 6,
    });
    mapRef.current = map;

    const initLayers = () => {
      // TODO: Week1 GeoJSON 을 addSource → addLayer 로 표시
      // TODO: map.on('click', layerId, ...) + popup 으로 properties 표시
    };
    map.on('load', initLayers);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // TODO: "내 동네로 이동" 버튼 → mapRef.current?.flyTo({ center, zoom })

  return <div ref={mapContainerRef} className="map-container" />;
};

export default Week2;
