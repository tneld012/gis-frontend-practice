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

import { validateGeoJSON } from "./validateGeoJSON";
import myAreaText from "./data/my-area.geojson?raw";

let myArea = null;

try {
  myArea = JSON.parse(myAreaText);
} catch {
  myArea = null;
}

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

  const validationResult = validateGeoJSON(myArea);

  return (
    <section className="placeholder">
      <h2>Week 1 · GeoJSON</h2>
      <pre>{JSON.stringify(myArea, null, 2)}</pre>
      <p>Feature 개수는 {validationResult.featureCount}개 입니다!</p>
      <div>
        {validationResult.hasPolygon ? (
          <>
            <p>
              Polygon ring은 {validationResult.isRingClosed ? "닫혀" : "열려"}{" "}
              있습니다!
            </p>
            <p>
              {validationResult.hasEnoughPoints
                ? "Polygon은 최소 점 개수를 만족합니다!"
                : "Polygon은 최소 4개의 점을 가져야합니다."}
            </p>
            <p>
              {validationResult.isValidCoordinates
                ? "Polygon의 모든 점이 좌표 범위(경도 −180~180 / 위도 −90~90)를 만족합니다!"
                : "Polygon의 좌표는 경도 −180~180 / 위도 −90~90를 만족해야합니다."}
            </p>
          </>
        ) : (
          <p>Polygon Feature가 없어 Polygon 검증을 수행할 수 없습니다.</p>
        )}
      </div>
      <p>GeoJSON 검증 결과: {validationResult.isValid ? "통과" : "실패"}</p>
    </section>
  );
};

export default Week1;
