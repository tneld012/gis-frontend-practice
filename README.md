# GIS 프론트엔드 4주 실습

JS/React 경험자가 GIS 프론트엔드(MapLibre, 타일, 공간연산)를 4주 동안 익히는 실습 레포입니다.
커리큘럼·퀴즈 본문은 멘토가 제공하는 문서를 참고하세요. 각 주차 미션은 `src/weeks/week-N/README.md` 에 있습니다.

## 기술 스택
- Vite + React 19 + TypeScript
- maplibre-gl (지도 렌더링)
- @turf/turf (공간연산)

## 시작하기
> 처음이라면 [환경 셋업 가이드 (docs/prerequisites.md)](docs/prerequisites.md) 를 먼저 확인하세요.
> (필수는 Node + pnpm 뿐. 모든 주차가 공개 타일을 소비하므로 GIS 전용 도구 설치는 없습니다.)

```bash
pnpm install
pnpm dev          # http://localhost:5173
```
상단 네비게이션에서 Week 1~4 를 전환하며 실습합니다.

추가 스크립트:
```bash
pnpm typecheck    # 타입 검사
pnpm build        # 타입 검사 + 프로덕션 빌드
```

> Week 3 은 직접 타일 서버를 띄우지 않고 **공개 타일을 소비**합니다. (설치 불필요)

## 주차 구성
| 주차 | 폴더 | 주제 |
|---|---|---|
| Week 1 | `src/weeks/week-1` | GeoJSON 직접 만들기 |
| Week 2 | `src/weeks/week-2` | MapLibre 기초 + React 통합 |
| Week 3 | `src/weeks/week-3` | 타일 소비 (raster/vector/동적 COG) |
| Week 4 | `src/weeks/week-4` | 그리기 + 공간연산 (미니 프로젝트) |

## 📤 공유 방식 — 주차별 브랜치 + PR

각 주차는 **별도 브랜치**에서 작업하고 **PR**로 공유합니다. (실무 협업 흐름 연습)

```bash
# 1. 원격 연결 (최초 1회) — 본인 GitHub 레포 주소로
git remote add origin <your-github-repo-url>
git push -u origin main

# 2. 주차 시작할 때 main 에서 브랜치 생성
git switch main
git switch -c week-1

# 3. 미션 작업 후 커밋 & 푸시
git add .
git commit -m "Week 1: GeoJSON 미션 공유"
git push -u origin week-1

# 4. GitHub 에서 week-1 → main 으로 Pull Request 생성
#    → 멘토가 PR 에 리뷰 코멘트, 보완 후 머지
```

브랜치 이름: `week-1`, `week-2`, `week-3`, `week-4`

> 한 주차를 머지한 뒤 다음 주차 브랜치는 다시 `main` 에서 분기하세요.
> (이전 주차 결과를 이어 쓰고 싶으면 이전 브랜치에서 분기해도 됩니다.)
