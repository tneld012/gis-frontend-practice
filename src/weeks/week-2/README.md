# Week 2 — MapLibre 기초 + React 통합

## 개념 퀴즈
1. source와 layer를 분리하는 이유는? 같은 source로 layer 두 개를 만드는 예는?
2. canvas/WebGL이라 `addEventListener`를 못 단다. 그럼 클릭을 어떻게 잡는가?
3. `map` 생성 직후 `addSource` 가 에러날 수 있는 이유와, 무엇을 기다려야 하는가?
4. 지도 인스턴스를 `useState` 가 아니라 `useRef` 에 두는 이유는?
5. Leaflet과 MapLibre 렌더링 차이 하나와 실무상 차이 하나는?

## 미션
- Week1 GeoJSON 을 표시하는 React 지도 컴포넌트 (`week-2.tsx`)
- 폴리곤 클릭 시 `properties` 를 popup 으로 표시
- "내 동네로 이동" 버튼 (`flyTo` 또는 `fitBounds`)

## 완성 체크 (여기까지 되면 OK)
- [x] 부모 리렌더링에도 지도가 다시 안 깨짐
- [x] 클릭 시 올바른 feature 정보가 뜸
- [x] 지도 인스턴스가 `ref` 로 관리됨

> 시작 코드에 map 초기화 + cleanup 골격이 있습니다. `// TODO` 부분을 채우세요.

## 🚀 Stretch goal (선택) — 지도 ↔ 앱 상태 연결
- 클릭한 feature를 **지도 밖 사이드 패널**에 표시 (상태를 컴포넌트 위로 끌어올리거나 Zustand 사용)
- 지도 밖 **목록에서 항목 클릭 → 해당 feature로 `flyTo` + 강조**(`feature-state`로 hover/selected 스타일)
- 목적: imperative 지도 ↔ declarative 상태를 한 방향으로 동기화 (신입이 가장 헤매는 지점)

## 📚 참고 자료
- MapLibre: [공식 문서](https://maplibre.org/maplibre-gl-js/docs/) · [예제 모음 (실습 베이스)](https://maplibre.org/maplibre-gl-js/docs/examples/) · [API 레퍼런스](https://maplibre.org/maplibre-gl-js/docs/API/)
- 핵심 API: [Map 라이프사이클·load 이벤트](https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/) · [queryRenderedFeatures](https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/#queryrenderedfeatures)
- Source/Layer 개념: [Style Spec](https://maplibre.org/maplibre-style-spec/) · [sources](https://maplibre.org/maplibre-style-spec/sources/) · [layers](https://maplibre.org/maplibre-style-spec/layers/)
- React 통합: [react-map-gl (MapLibre 지원)](https://visgl.github.io/react-map-gl/) · [예제 모음](https://visgl.github.io/react-map-gl/examples)
- 렌더링 모델: [MDN: WebGL 기초](https://developer.mozilla.org/ko/docs/Web/API/WebGL_API)
- 🇰🇷 한국어: [React + MapLibre 시작하기 (MapTiler)](https://docs.maptiler.com/react/maplibre-gl-js/get-started/) · [react-korea-map-visualization (예제 레포)](https://github.com/YeonjuRyu/react-korea-map-visualization)
