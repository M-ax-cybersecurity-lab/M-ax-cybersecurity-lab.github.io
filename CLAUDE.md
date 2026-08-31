# 연구실 웹사이트 프로젝트

## 소속
- 학교: 한국해양대학교
- 학과: 해사인공지능보안학과 (사이버보안전공)
- 랩 이름: **해사 AX 보안공학 연구실** (영문: M-AX Cybersecurity Lab) — 확정됨 (2026-08-27), `content/site.json`의 labNameKo/labNameEn에 반영됨

## 배포 스택
- GitHub: 개인 계정이 아닌 **Organization(조직 계정)** `m-ax-lab` 생성 완료, 그 아래 `lab-website` 레포 생성 및 push 완료 — 특정 개인이 나가거나 계정을 삭제해도 사이트가 유지되도록 함
- Netlify: 무료 티어로 호스팅, 레포 연결 및 배포 완료
- Decap CMS 인증: **GitHub OAuth 방식** (Netlify Identity + Git Gateway 아님 — 2026-08-27에 전환, 이유는 아래 참고). `admin/config.yml`의 backend가 `{name: github, repo: m-ax-lab/lab-website, branch: main}`
- 전체 스택 비용: 무료 (커스텀 도메인 구매는 선택사항)

### Git Gateway 대신 GitHub OAuth를 쓰는 이유
Netlify Identity + Git Gateway로 진행하다가 Identity 대시보드가 정상 동작하지 않는 문제 발생. 원인은 private 저장소여서가 아니라 **Git Gateway가 Netlify에서 deprecated 상태**이기 때문(신규 설정 비권장, 버그 수정 중단). Identity 자체는 살아있지만 Git Gateway 연동에 문제가 있어, 여전히 정식 지원되는 GitHub OAuth 백엔드로 전환함. 설정법: ① GitHub에서 OAuth App 등록 (Authorization callback URL: `https://api.netlify.com/auth/done`) ② Netlify: Project configuration → Access & security → OAuth → GitHub에 Client ID/Secret 입력.

## 현재 단계
랩 이름 확정, GitHub 조직/레포 생성 및 push, Netlify 연결(배포)까지 완료. 남은 단계: GitHub OAuth App 등록 → Netlify Access & security에 연결 → `/admin` 로그인 확인 (사용자가 직접 진행).

## 콘텐츠/디자인 원칙
- 레이아웃(디자인) 코드와 콘텐츠(구성원, 논문, 뉴스, 사진 등)는 분리해서 관리 — 콘텐츠 파일만 수정하면 되도록 구성 (추후 Decap CMS 편집 대상)
- 참고 사이트 목록: [ref_link/link.md](ref_link/link.md)

## 메뉴 구조
- **About**: Welcome, Contact us
- **People**: 구성원 목록. 별도 Contact 페이지 없이, People 페이지에서 각 구성원 이메일 클릭 시 gmail로 바로 연결(mailto 또는 gmail 컴포즈 링크)
- **Research**: Areas, Projects, Facility
- **Publications**
- **News**

## 파일 구조 (프레임 구현됨)
- 순수 HTML/CSS/JS 정적 사이트, 빌드 툴 없음 (Netlify에 바로 배포 가능)
- 페이지: `index.html`, `people.html`, `research.html`, `publications.html`, `news.html`
- 공통 헤더/푸터: `assets/partials/header.html`, `footer.html` (fetch로 삽입 — `assets/js/main.js`)
- 콘텐츠 데이터: `content/site.json`, `people.json`, `research.json`, `benefits.json`, `publications.json`, `news.json` — 이 파일들만 수정하면 사이트 전체 반영됨 (레이아웃 코드는 건드릴 필요 없음). `site.json`/`research.json` 제외하고는 전부 `{ "필드명": [...] }` 형태로 배열을 감싼 구조 (Decap CMS file collection과 호환되도록)
- Decap CMS 설정: `admin/config.yml`(컬렉션 정의), `admin/index.html` — GitHub OAuth App을 Netlify에 연결하기 전까지는 작동 안 함
- 렌더링 로직: `assets/js/content.js`
- 로컬 미리보기: `.claude/launch.json` → `python3 -m http.server 5173`
- 랩 이름은 확정 반영됨(`content/site.json`), 구성원/논문/뉴스 등은 아직 placeholder 상태
- Research의 Facility/Project는 카드 클릭 시 모달로 사진+상세설명(`detail` 필드) 표시 (`assets/js/content.js`의 openDetailModal)
- People 표기는 영문 (역할 그룹명 및 개별 직함 모두)
- 콘텐츠 JSON은 전부 배열 구조 — Decap CMS 연결 시 list/folder collection으로 매핑하면 관리자 페이지에서 항목 추가/삭제가 자동 제공됨

## 테스트용 미리보기 (완료 및 제거됨)
로컬 프레임 확인 단계에서 Streamlit(`test/`) → GitHub Pages(`docs/`) 순으로 시도했으나, 실제 스택(GitHub 조직 + Netlify)이 연결된 뒤로는 불필요해져 `docs/`는 삭제함(2026-08-27). 참고 기록은 [PROJECT_NOTES.md](PROJECT_NOTES.md)에 있음.

## 톤/디자인 방향
한국해양대학교 해사인공지능보안학과(사이버보안전공) 소속에 맞는 톤 — 보안/공학 계열 연구실다운 신뢰감 있고 전문적인 느낌으로 진행 (세부 톤은 추후 확정).
