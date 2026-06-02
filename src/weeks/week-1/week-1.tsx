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
import type { FeatureCollection } from 'geojson';

// TODO: data/my-area.geojson 을 만든 뒤 아래 주석을 해제하세요.
// import myArea from './data/my-area.geojson';
const myArea: FeatureCollection | null = null;

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

  // TODO: features 개수 표시, Polygon ring 이 닫혀 있는지 검증 결과 표시
  return (
    <section className="placeholder">
      <h2>Week 1 · GeoJSON</h2>
      <pre>{JSON.stringify(myArea, null, 2)}</pre>
    </section>
  );
};

export default Week1;
