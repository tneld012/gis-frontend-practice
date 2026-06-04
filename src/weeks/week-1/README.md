# Week 1 — GeoJSON 직접 만들기

## 개념 퀴즈 (먼저 자기 말로 답해보기)
1. EPSG:4326과 EPSG:3857은 각각 무엇이고, 언제 쓰는가?
2. GeoJSON 좌표는 `[경도, 위도]` 순서다. 왜 헷갈리기 쉽고, 어떤 실수로 이어지는가?
3. Polygon의 `coordinates`는 왜 이중 중첩 배열인가? 첫 ring과 그 다음 ring의 의미는?
4. 줌 레벨이 1 증가하면 타일 개수는 어떻게 변하는가?
5. `interface`와 `type`의 차이 하나, `as` 단언이 위험한 이유는?

## 미션
- `data/my-area.geojson` 을 **에디터로 직접 타이핑**한다. (생성기 사용 금지)
  - 우리 동네 폴리곤 1개 + 관심 지점(Point) 3개
- `week-1.tsx` 의 import 주석을 해제해 화면에 표시하고, feature 개수 + ring 닫힘 검증을 출력한다.
- geojson.io 에 붙여넣어 의도한 위치에 그려지는지 확인한다.

## 완성 체크 (여기까지 되면 OK)
- [x] 유효한 `FeatureCollection`
- [x] Polygon ring 이 닫혀 있음 (첫 좌표 = 끝 좌표)
- [x] 각 Feature 에 의미 있는 `properties` 포함
- [x] geojson.io 에서 올바른 위치에 렌더링됨

> 참고: `data/my-area.example.geojson` 에 형식 예시가 있습니다. 그대로 복사하지 말고 직접 작성하세요.

## 🚀 Stretch goal (선택) — TS로 GeoJSON 검증기
- `validateGeoJSON(fc)` 를 **strict 타입**으로 작성 (`any` 금지, 타입 가드 사용)
  - Polygon ring 닫힘, 좌표 범위(경도 −180~180 / 위도 −90~90), ring 최소 4점 검사
- (더) **구멍(hole) 있는 Polygon** GeoJSON도 작성해 통과시키기
- 목적: TS 타입 좁히기 + GeoJSON 구조를 코드로 다뤄보기

## 📚 참고 자료
- TypeScript: [JS 개발자를 위한 TS](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html) · [핸드북](https://www.typescriptlang.org/docs/handbook/intro.html)
- 좌표계: [EPSG:4326](https://epsg.io/4326) · [EPSG:3857](https://epsg.io/3857) · [MapTiler: 좌표계와 타일 투영](https://www.maptiler.com/google-maps-coordinates-tile-bounds-projection/)
- GeoJSON: [RFC 7946 명세](https://datatracker.ietf.org/doc/html/rfc7946) · [geojson.io (실습)](https://geojson.io) · [GeoJSON에 대해 알고 싶은 모든 것 (Tom MacWright)](https://macwright.com/2015/03/23/geojson-second-bite)
- 🇰🇷 한국어: [TypeScript 한글 핸드북](https://typescript-kr.github.io/) · [GeoJSON 형식 설명 (GIS Developer)](http://www.gisdeveloper.co.kr/?p=8002) · [지도 및 타일 좌표 (Google, 한국어)](https://developers.google.com/maps/documentation/javascript/coordinates?hl=ko)
