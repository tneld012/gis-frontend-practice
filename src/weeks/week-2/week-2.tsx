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
import { useEffect, useRef, useState } from 'react';

import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import type { Feature } from "geojson";

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
  const [selectedFeature, setSelectedFeature] =
  useState<Feature | null>(null);
  const selectedFeatureIdRef = useRef<string | number | null>(null); // feature.id가 숫자일 가능성 고려

  const selectFeature = (feature:Feature) => {
    setSelectedFeature(feature);

    if (feature.geometry.type === "Point") {
      const [lng, lat] = feature.geometry.coordinates;

      mapRef.current?.flyTo({
        center: [lng, lat],
        zoom: 15,
      });
    }

    if (feature.geometry.type === "Polygon") {
      const ring = feature.geometry.coordinates[0];

      let minLng = Infinity;
      let minLat = Infinity;
      let maxLng = -Infinity;
      let maxLat = -Infinity;

      for (const point of ring) {
        const lng = point[0];
        const lat = point[1];

        minLng = Math.min(minLng, lng);
        minLat = Math.min(minLat, lat);
        maxLng = Math.max(maxLng, lng);
        maxLat = Math.max(maxLat, lat);
      }

      mapRef.current?.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat],
        ],
        {
          padding: 50,
        },
      );
    }

    const featureId = feature.properties?.id;
    if (featureId == null) return;

    if (selectedFeatureIdRef.current != null) {
      mapRef.current?.setFeatureState(
        {
          source: "my-area",
          id: selectedFeatureIdRef.current,
        },
        {
          selected: false,
        },
      );
    }

    mapRef.current?.setFeatureState(
      {
        source: "my-area",
        id: featureId,
      },
      {
        selected: true,
      },
    );

    selectedFeatureIdRef.current = featureId;
  };

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
      
      if (myArea ===null) return;

      map.addSource("my-area", {
        type: "geojson",
        data: myArea,
        promoteId: "id",
      });

      map.addLayer({
        id: "my-area-fill",
        type: "fill",
        source: "my-area",
        filter: ["==", ["geometry-type"], "Polygon"],
        paint: {
          "fill-color": [
            "case",
            ["boolean", ["feature-state", "selected"], false],
            "#f97316",
            "#4260f5",
          ],
          "fill-opacity": 0.4,
        }
      });

      map.addLayer({
        id: "my-area-points",
        type: "circle",
        source: "my-area",
        filter: ["==", ["geometry-type"], "Point"], // geometry type이 Point인 Feature만 그리기
        paint: {
          "circle-color": [
            "case",
            ["boolean", ["feature-state", "selected"], false],
            "#f97316",
            "#b0ddff",
          ],
          "circle-radius":  [
            "case",
            ["boolean", ["feature-state", "selected"], false],
            10,
            6,
          ],
        }
      });

      map.on("click", "my-area-fill", (event) => {
        const feature = event.features?.[0];

        if (feature == null) return;

        selectFeature(feature);

        const name = feature.properties?.name;
        const kind = feature.properties?.kind;

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

  const moveToMyArea = () => {
    mapRef.current?.fitBounds(
      [
        [129.280, 35.528],
        [129.300, 35.545],
      ],
      {
        padding: 50,
      },
    );
  };

  if (myArea == null) {
    return <p>GeoJSON 데이터를 불러오지 못했습니다.</p>;
  }

  return (
    <>
      <button onClick={moveToMyArea}>
        내 동네로 이동
      </button>

      <aside>
        <h3>Feature 목록</h3>
        <ul>
          {myArea.features.map((feature: Feature, index: number) => (
            <li key={index}>
              <button
                type="button"
                onClick={() => {
                  selectFeature(feature);
                }}
              >
                {feature.properties?.name} ({feature.properties?.kind})
              </button>
            </li>
          ))}
        </ul>

        <h3>선택한 Feature</h3>
        {selectedFeature == null ? (
          <p>아직 선택한 Feature가 없습니다!</p>
        ) : (
          <div>
            <div style={{ fontSize: "16px", color: "#4260f5", fontWeight: "bold" }}>
              {selectedFeature.properties?.name}
            </div>
            <div style={{ fontSize: "14px", color: "#666" }}>
              {selectedFeature.properties?.kind}
            </div>
            <div style={{ fontSize: "12px", color: "#999" }}>
              Geometry: {selectedFeature.geometry.type}
            </div>
          </div>
        )}
      </aside>

      <div ref={mapContainerRef} className="map-container" />
    </>
  )
};

export default Week2;
