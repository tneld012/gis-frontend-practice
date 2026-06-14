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

import myAreaText from '../week-1/data/my-area.geojson?raw';

let myArea = null;

try {
  myArea = JSON.parse(myAreaText);
} catch {
  myArea = null;
}

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
      if (myArea ===null) return;

      map.addSource("my-area", {
        type: "geojson",
        data: myArea,
      });

      map.addLayer({
        id: "my-area-fill",
        type: "fill",
        source: "my-area",
        filter: ["==", ["geometry-type"], "Polygon"],
        paint: {
          "fill-color": "#4260f5",
          "fill-opacity": 0.4,
        }
      });

      map.addLayer({
        id: "my-area-points",
        type: "circle",
        source: "my-area",
        filter: ["==", ["geometry-type"], "Point"], // geometry type이 Point인 Feature만 그리기
        paint: {
          "circle-color": "#b0ddff",
          "circle-radius": 6,
        }
      });
      // TODO: map.on('click', layerId, ...) + popup 으로 properties 표시
      map.on("click", "my-area-fill", (event) => {
        const feature = event.features?.[0];

        if (feature == null) return;

        const name = feature.properties.name;
        const kind = feature.properties.kind;

        new maplibregl.Popup()
          .setLngLat(event.lngLat)
          .setHTML(`
            <div>
              <div style="font-size:16px; color:#4260f5; font-weight:bold;">
                ${name}
              </div>
              <div style="font-size:14px; color:#666;">
                ${kind}
              </div>
            </div>
          `)
          .addTo(map);
      });
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
