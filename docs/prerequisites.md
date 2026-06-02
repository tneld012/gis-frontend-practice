# 환경 셋업 가이드 (PREREQUISITES)

실습 시작 전에 아래 도구를 준비합니다. **필수는 Node + pnpm 뿐**입니다. 모든 주차가 공개 타일을 소비하므로 GIS 전용 도구 설치는 없습니다. (Week 3 의 TiTiler 서빙 체험만 선택적으로 Docker 사용)

---

## 1. 필수 — Node.js + pnpm (Week 1~4 전부)

### Node.js (LTS 권장)
```bash
node -v   # v20 이상이면 OK
```
없으면 [nodejs.org](https://nodejs.org/) 에서 LTS 설치. (버전 관리가 필요하면 [nvm](https://github.com/nvm-sh/nvm) 추천)

### pnpm
```bash
corepack enable        # Node 16.13+ 에 내장된 corepack 으로 활성화
pnpm -v                # 버전 출력되면 OK
```
corepack 이 안 되면: `npm install -g pnpm`

### 프로젝트 설치
```bash
pnpm install
pnpm dev               # http://localhost:5173
```

---

## 2. 권장 — VS Code 확장

- **ESLint** / **Prettier** — 코드 스타일
- **Error Lens** — 타입 에러를 줄 옆에 바로 표시 (신입에게 특히 유용)

---

## 3. Week 3 — 설치할 것 없음 (공개 타일 소비)

프론트엔드는 타일을 **소비**만 하므로 GDAL·타일 서버 설치가 필요 없습니다.
Week 3 은 이미 호스팅된 공개 타일을 가져다 씁니다.
- 위성 raster: ESRI World Imagery (키 불필요, 시작 코드에 포함)
- vector 비교: MapLibre demotiles
- 동적 COG: titiler.xyz 공개 데모

→ 별도 준비 없이 `pnpm dev` 로 바로 진행하면 됩니다.

---

## 4. (선택) Week 3 보너스 — Docker 로 TiTiler 띄워보기

"서빙하는 쪽"을 한 번 체험하고 싶을 때만. **GDAL 설치 불필요**, Docker 만 있으면 됩니다.

```bash
# 내부 포트 80 → 로컬 8000 으로 매핑
docker run --rm -p 8000:80 ghcr.io/developmentseed/titiler:latest

# 동작 확인 (다른 터미널)
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/healthz   # 200 이면 OK
```
타일/COG 사용법은 Week 3 README 의 "보너스" 항목 참고. Docker 가 없으면 공개 데모 `https://titiler.xyz` 로 대체합니다.

> Docker Desktop: [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/)

---

## 막히면?
- `pnpm install` 실패 → Node 버전(v20+) 먼저 확인
- 지도가 안 뜸 → 브라우저 콘솔(F12) 에러 확인, 네트워크 탭에서 타일 요청 상태(200) 확인
- 위성 타일이 안 뜸 → ESRI URL 의 `{z}/{y}/{x}` 순서 확인 (x/y 가 바뀌면 엉뚱한 타일)
