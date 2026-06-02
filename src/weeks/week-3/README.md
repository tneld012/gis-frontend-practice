# Week 3 — 타일 소비하기 (raster / vector / 동적 COG)

> 프론트엔드는 타일을 **서빙**하지 않고 **소비**합니다.
> 그래서 이 주차는 직접 서버를 띄우지 않고, **이미 호스팅된 공개 타일**을 가져다 씁니다. (설치할 것 없음)

## 개념 퀴즈
1. XYZ와 TMS 타일 좌표 체계의 차이는? (y축 힌트)
2. raster 타일과 vector 타일의 차이를 3가지 말하라.
3. 다크모드 베이스맵: raster면 왜 곤란하고 vector면 왜 쉬운가?
4. 일반 GeoTIFF 대신 COG를 쓰면 뭐가 좋아지나? 어떻게 가능한가? (HTTP 힌트)
5. 우리가 raster와 vector를 둘 다 쓰는 이유는?

## 미션 — 공개 타일 소비
- **raster**: 공개 위성영상 타일(ESRI World Imagery, 시작 코드에 포함)을 베이스맵으로 표시
- **vector 비교**: MapLibre 데모 vector(`https://demotiles.maplibre.org/style.json`)와 비교
  - 확대 시 깨짐 차이, 클릭(feature 조회) 가능 여부를 직접 확인
- 완성 체크 (여기까지 되면 OK):
  - [ ] 위성 raster 타일이 줌/팬에 맞춰 올바른 위치에 뜸
  - [ ] raster vs vector 차이를 캡처/메모로 정리

## 보너스 — "서빙하는 쪽" 체험 (GDAL 불필요, Docker 한 줄)

프론트는 소비만 하지만, 우리 제품처럼 **COG + TiTiler**로 타일을 내주는 쪽도 한 번 띄워보면 전체 그림이 완성됩니다. GDAL 설치 없이 Docker로:

```bash
# 1. TiTiler 서버 띄우기 (내부 포트 80 → 로컬 8000 으로 매핑)
docker run --rm -p 8000:80 ghcr.io/developmentseed/titiler:latest

# 2. 공개 COG 를 가리키는 동적 타일 URL (앞부분 고정, {z}/{x}/{y} 만 MapLibre 가 채움)
#    http://localhost:8000/cog/tiles/WebMercatorQuad/{z}/{x}/{y}?url=<COG_URL>
```

예시 공개 COG (콜로라도, 줌 10~18, 중심 약 lng -108.5 / lat 39.5):
```
https://opendata.digitalglobe.com/events/california-fire-2020/pre-event/2018-02-16/pine-gulch-fire20/1030010076004E00.tif
```

- 이 동적 타일을 `week-3.tsx` 에 raster source 로 추가하고, 해당 위치로 `flyTo` 해서 떠는지 확인
- 직접 띄우기 부담되면 **공개 데모** `https://titiler.xyz` 가 동일 API를 제공합니다. (`https://titiler.xyz/cog/tiles/WebMercatorQuad/{z}/{x}/{y}?url=<COG_URL>`)
- 포인트: 원본 COG 파일을 통째로 받지 않고, TiTiler 가 **HTTP Range 로 필요한 영역만 읽어** 즉석에서 타일을 만들어준다는 것.

## 🚀 Stretch goal (선택) — 동적 타일 파라미터 / 베이스맵 제어
- titiler 동적 타일 URL에 `colormap_name`·`rescale` 쿼리 파라미터를 바꿔보고 화면이 달라지는지 확인 → **동적 타일링의 진짜 장점** 체감
- raster 위성 ↔ vector 데모 **베이스맵 토글 버튼** + 위성 레이어 **투명도 슬라이더**(`raster-opacity`)
- 목적: 런타임 스타일 제어 = "데이터 기반 스타일링"의 입구

## 📚 참고 자료
- 타일 좌표: [OSM Wiki: Slippy map tilenames (XYZ)](https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames) · [MapTiler: 타일 좌표/투영](https://www.maptiler.com/google-maps-coordinates-tile-bounds-projection/)
- Vector 타일: [Mapbox Vector Tile 명세](https://github.com/mapbox/vector-tile-spec) · [vector tile 이란 (MapTiler)](https://docs.maptiler.com/cloud/api/tiles/)
- 공개 타일 소스: [ESRI World Imagery](https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9) · [MapLibre demotiles](https://demotiles.maplibre.org/)
- 동적 타일링(위성영상): [Cloud Optimized GeoTIFF (COG) 소개](https://www.cogeo.org/) · [TiTiler 공식 문서](https://developmentseed.org/titiler/) · [titiler.xyz 공개 데모](https://titiler.xyz/)
- 🇰🇷 한국어: [벡터 타일: 웹에서 대용량 공간 데이터 시각화 (VW-LAB)](https://www.vw-lab.com/117) · [줌 레벨과 타일 그리드 (Azure Maps, 한국어)](https://learn.microsoft.com/ko-kr/azure/azure-maps/zoom-levels-and-tile-grid) · [OpenStreetMap 이용하기 (osm.kr)](https://osm.kr/usage/)
