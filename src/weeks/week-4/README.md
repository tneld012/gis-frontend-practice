# Week 4 — 그리기 + 공간연산 (최종 미니 프로젝트)

## 개념 퀴즈

1. `mapbox-gl-draw` 로 그린 도형은 어떤 데이터 형태로 나오는가?
2. Turf `area` 의 단위는? km² 로 바꾸려면?
3. `project` / `unproject` 는 각각 무엇을 무엇으로 변환하는가?
4. "최소 면적 미달 경고" 검증 로직은 어느 이벤트 시점에 실행하는 게 맞는가?
5. centroid 를 구해서 어디에 쓸 수 있는가?

## 미니 프로젝트

> "공개 위성영상 타일 위에, 사각형/폴리곤 AOI 를 그리고 면적을 표시한다.
> 최소 면적(0.01 km²) 미달이면 경고를 띄운다."

- [x] 공개 위성 타일(ESRI 등)이 베이스맵으로 뜬다 (Week 3)
- [x] React 컴포넌트로 지도가 관리된다 (Week 2)
- [x] AOI 를 그릴 수 있다 (draw)
- [x] 그린 AOI 면적이 km² 로 표시된다 (Turf)
- [x] 최소 면적 미달 시 경고가 뜬다
- [x] (보너스) AOI 클릭 시 면적 popup

## 그리기 라이브러리 선택

- `@mapbox/mapbox-gl-draw` 는 mapbox-gl 기준이라 MapLibre 와는 호환 어댑터/주의가 필요.
- **MapLibre 만 쓴다면 [Terra Draw](https://terradraw.io/) 가 마찰이 적습니다.** 어느 쪽이든 직접 붙여보고 차이를 README 에 적어보세요.

## 공유 자료

- 동작 데모 (GIF 또는 30초 영상)
- README: 실행 방법 + 배운 점 3줄

## 🚀 Stretch goal (선택) — AOI 저장/복원 + 겹침 검사

- 그린 AOI를 **저장**(localStorage 또는 목 API + TanStack Query mutation)하고 **새로고침 후 복원**
- 미리 정의한 구역과 `booleanIntersects`로 **겹치는지 검사**해 경고
- **데이터 기반 스타일**: 최소 면적 통과/미달에 따라 AOI 색을 다르게
- 목적: satchat의 실제 AOI 저장 흐름(서버 연동)에 가장 가까운 연습

## 📚 참고 자료

- 그리기: [mapbox-gl-draw (GitHub)](https://github.com/mapbox/mapbox-gl-draw) · [API 문서](https://github.com/mapbox/mapbox-gl-draw/blob/main/docs/API.md) · [Terra Draw (MapLibre 친화 대안)](https://terradraw.io/)
- Turf.js: [공식 사이트](https://turfjs.org/) · [전체 API 문서](https://turfjs.org/docs/) · [area (면적)](https://turfjs.org/docs/api/area) · [centroid](https://turfjs.org/docs/api/centroid) · [booleanIntersects](https://turfjs.org/docs/api/booleanIntersects)
- 좌표↔픽셀: [Map.project](https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/#project) · [Map.unproject](https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/#unproject)
- 🇰🇷 한국어: [GIS Developer (공간정보 자료 모음)](http://www.gisdeveloper.co.kr/) · [웹 기반 공간정보 서비스 GEOSERVICE-WEB](https://gisdeveloper.co.kr/?p=6265)
