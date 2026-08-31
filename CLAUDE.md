# 연구실 웹사이트 프로젝트

## 소속
- 학교: 한국해양대학교
- 학과: 해사인공지능보안학과 (사이버보안전공)
- 랩 이름: **해사 AX 보안공학 연구실** (영문: M-AX Cybersecurity Lab) — 확정됨 (2026-08-27), `docs/content/site.json`의 labNameKo/labNameEn에 반영됨

## 배포 스택
- **GitHub**: 공용(공유) 계정 `M-ax-cybersecurity-lab` (Organization 아님, 랩 멤버가 로그인 정보를 공유해서 쓰는 일반 계정) 소유, 레포 `M-ax-cybersecurity-lab.github.io` — 저장소 이름이 계정 이름과 정확히 같아야 GitHub Pages가 루트 도메인으로 서빙함
- **사이트 주소**: `https://m-ax-cybersecurity-lab.github.io/` (GitHub Pages, Settings → Pages → Branch: main, Folder: /docs)
- **콘텐츠 편집 방식**: CMS 없음. `docs/content/*.json` 파일을 GitHub 웹 UI에서 직접 편집하거나, 로컬에서 고쳐서 push. 사이트는 그냥 정보 전달용이라 코드 수정 없이 편집 가능한 관리자 페이지까지는 필요 없다고 판단해서 뺌 (2026-08-31 결정 — 자세한 경위는 [PROJECT_NOTES.md](PROJECT_NOTES.md) 참고)
- 전체 스택 비용: 완전 무료, 크레딧/빌링 걱정 없음 (GitHub Pages는 크레딧제가 아님)

### 왜 Netlify + Decap CMS를 버렸는가 (2026-08-31)
원래는 GitHub 조직(`m-ax-lab`) + Netlify + Decap CMS(GitHub OAuth 인증) 스택으로 구축했었음. 두 가지 문제로 폐기함:
1. **Netlify 무료 플랜 크레딧 소진**: 월 300 크레딧, 배포 1회당 15 크레딧 — 자잘한 수정마다 push/CMS 저장을 반복하다가 하루 만에 크레딧을 다 써서 사이트가 일시정지됨
2. **Netlify 팀 멤버 추가가 유료**: Free/Personal 플랜은 1석 제한이라 인계할 사람을 추가하려면 Pro($20/월) 필요
그래서 순수 정적 사이트에 굳이 유료 위험이 있는 스택을 쓸 이유가 없다고 판단, GitHub Pages(완전 무료, 무제한, 크레딧 없음)로 전환하고 CMS도 같이 걷어냄. GitHub 계정도 조직 대신 공용 계정으로 새로 팠음(이유는 사용자 선택).

### SSH 접근
이 서버(로컬 작업 환경)는 `M-ax-cybersecurity-lab` 계정 전용 SSH 키를 씀 — 회원님 개인 계정 키와 별도.
- 키 위치: `~/.ssh/id_ed25519_maxlab` (개인키), `~/.ssh/id_ed25519_maxlab.pub` (공개키, 이미 해당 GitHub 계정의 SSH Keys에 등록됨)
- `~/.ssh/config`에 `Host github-maxlab` 별칭으로 등록해둠 — git remote는 `github-maxlab:M-ax-cybersecurity-lab/M-ax-cybersecurity-lab.github.io.git` 형태로 이 별칭을 사용
- 다른 서버/사람이 push하려면 이 공개키를 새로 만들어서 같은 방식으로 계정에 등록해야 함 (개인키는 공유 금지, 필요하면 각자 새로 키를 만들어 계정에 추가하는 게 맞음)

## 작업 워크플로우 (항상 지킬 것)
콘텐츠는 GitHub 웹 UI에서 직접 편집될 수도 있으므로(이 세션이 모르는 사이에), **로컬에서 뭔가를 수정하고 커밋하기 전에 항상 먼저 `git pull`로 최신 상태를 받아온 뒤 작업을 시작한다** — 순서: `git pull` → (필요시 원격에 새 커밋 있으면 무슨 내용인지 확인) → 로컬 수정 → 커밋 → push.

## 현재 단계
**GitHub Pages 스택으로 전환 완료.** 랩 이름 확정, `docs/`로 사이트 파일 이동, Decap CMS(`admin/`) 제거, 새 공용 GitHub 계정/레포로 이전 및 SSH 키 등록까지 완료. 남은 것: 사용자가 GitHub Settings → Pages에서 활성화(Branch: main, Folder: /docs) 확인, 실제 콘텐츠(구성원/논문/뉴스/연구 정보, 사진) 계속 채우기.

## 콘텐츠/디자인 원칙
- 레이아웃(디자인) 코드와 콘텐츠(구성원, 논문, 뉴스, 사진 등)는 분리해서 관리 — `docs/content/*.json` 파일만 수정하면 되도록 구성
- 화면에 보이는 텍스트는 최대한 데이터 파일에서 오도록 구성되어 있음(하드코딩 최소화) — CMS는 없지만 JSON 구조 자체는 그대로 유지, 나중에 필요해지면 다시 CMS를 붙이기도 쉬움
- 참고 사이트 목록: [ref_link/link.md](ref_link/link.md)

## 메뉴 구조
- **About**: Welcome, Benefits, Contact us
- **People**: 구성원 목록. 별도 Contact 페이지 없이, People 페이지에서 각 구성원 이메일 클릭 시 Gmail 작성 화면으로 바로 연결
- **Research**: Areas, Projects, Facility
- **Publications**
- **News**

## 파일 구조
- 순수 HTML/CSS/JS 정적 사이트, 빌드 툴 없음
- **`docs/`가 실제로 배포되는 사이트 루트** (GitHub Pages Folder: /docs 설정). 저장소 루트의 `CLAUDE.md`/`PROJECT_NOTES.md`/`ref_link/`는 배포 대상이 아니라 내부 참고 문서
- 페이지: `docs/index.html`, `people.html`, `research.html`, `publications.html`, `news.html`
- 공통 헤더/푸터: `docs/assets/partials/header.html`, `footer.html` (fetch로 삽입 — `docs/assets/js/main.js`)
- 콘텐츠 데이터: `docs/content/site.json`(진짜 사이트 전역 정보), `nav.json`(메뉴 라벨), `about.json`(About 페이지 전체: Welcome+Benefits+Contact), `people.json`, `research.json`, `publications.json`, `news.json` — 각 페이지가 자기 자신의 이용구/제목/설명 필드와 리스트를 함께 갖는 구조. `docs/assets/js/main.js`가 이 파일들을 전부 fetch해서 하나로 합쳐 `data-site-field` 조회에 사용함(`SITE_FIELD_SOURCES` 배열)
- 렌더링 로직: `docs/assets/js/content.js`
- 로컬 미리보기: `.claude/launch.json` → `python3 -m http.server 5173 --directory docs`
- 랩 이름은 확정 반영됨, 구성원 중 지도교수(이대성)는 실제 정보 반영됨, 나머지 구성원/논문/뉴스 등은 아직 placeholder 상태
- 배너는 실사진이 아니라 CSS로 그린 보안/네트워크 느낌의 추상 SVG 패턴 (`assets/css/style.css`의 `.hero`). `site.json`의 `bannerImage`를 채우면 그 사진이 우선 적용되도록 되어 있음(현재는 비어있음)
- Research의 Facility/Project는 카드 클릭 시 모달로 사진+상세설명(`detail` 필드) 표시. People의 Professor 카드는 클릭 시 사진 없이 학력/경력(`cv` 필드)만 모달로 표시 (`assets/js/content.js`의 openDetailModal)
- People 표기는 영문 (역할 그룹명 및 개별 직함 모두)
- 콘텐츠 JSON은 전부 배열/객체 구조로 정리되어 있어 사람이 직접 편집하기도 어렵지 않음

## 톤/디자인 방향
한국해양대학교 해사인공지능보안학과(사이버보안전공) 소속에 맞는 톤 — 보안/공학 계열 연구실다운 신뢰감 있고 전문적인 느낌으로 진행 (세부 톤은 추후 확정).
