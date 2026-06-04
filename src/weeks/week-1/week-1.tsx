/**
 * Week 1 — GeoJSON 직접 만들기
 *
 * 이 주차는 지도 코드보다 "GeoJSON 구조 이해"가 목표입니다.
 * 1. data/my-area.geojson 파일을 직접 타이핑해서 만드세요. (생성기 사용 금지)
 * 2. 아래 화면에서 feature 개수와 검증 결과를 확인하세요.
 * 3. geojson.io 에도 붙여넣어 의도한 위치에 그려지는지 확인하세요.
 *
 * 자세한 미션 내용: ./README.md
 */

import myAreaText from './data/my-area.geojson?raw';

const myArea = JSON.parse(myAreaText);

const Week1 = () => {
  if (myArea == null) {
    return (
      <section className="placeholder">
        <h2>Week 1 · GeoJSON 직접 만들기</h2>
        <p>
          아직 <code>data/my-area.geojson</code> 이 연결되지 않았습니다.
          <br />
          미션 설명은 <code>src/weeks/week-1/README.md</code> 를 참고하세요.
        </p>
      </section>
    );
  }

  const featureCount = myArea.features.length;

  const ring = myArea.features[0].geometry.coordinates[0];

  const first = ring[0];
  const last = ring[ring.length - 1];

  const isRingClosed = first[0] === last[0] && first[1] === last[1];

  return (
    <section className="placeholder">
      <h2>Week 1 · GeoJSON</h2>
      <pre>{JSON.stringify(myArea, null, 2)}</pre>
      <p>Feature 개수는 {featureCount}개 입니다!</p>
      <p>Polygon ring은 {isRingClosed ? '닫혀' : '열려'}있습니다!</p>
    </section>
  );
};

export default Week1;
