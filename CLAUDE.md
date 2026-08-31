# 연구실 웹사이트 프로젝트

## 소속
- 학교: 한국해양대학교
- 학과: 해사인공지능보안학과 (사이버보안전공)
- 랩 이름: **해사 AX 보안공학 연구실** (영문: M-AX Cybersecurity Lab) — 확정됨 (2026-08-27), `content/site.json`의 labNameKo/labNameEn에 반영됨

## 배포 스택
- **사이트 주소**: https://m-ax-cybersecurity-lab.netlify.app/ (Visitor access는 Public으로 설정됨 — 2026-07-28부터 Netlify 신규 팀 기본값이 Private라서 처음엔 팀 로그인 없이 접속 불가였다가 수정함)
- GitHub: 개인 계정이 아닌 **Organization(조직 계정)** `m-ax-lab` 생성 완료, 그 아래 `lab-website` 레포(public) 생성 및 push 완료 — 특정 개인이 나가거나 계정을 삭제해도 사이트가 유지되도록 함. Netlify 무료 플랜은 조직 소유 private 레포 배포를 지원하지 않아 public으로 전환함 (소스에 민감정보 없음 확인됨)
- Netlify: 무료 티어로 호스팅, 레포 연결 및 배포 완료
- Decap CMS 인증: **GitHub OAuth 방식** (Netlify Identity + Git Gateway 아님 — 2026-08-27에 전환, 이유는 아래 참고). `admin/config.yml`의 backend가 `{name: github, repo: m-ax-lab/lab-website, branch: main}`. `/admin`에서 GitHub 로그인 후 콘텐츠 편집 → 저장하면 레포에 자동 커밋 → Netlify 자동 재배포
- 전체 스택 비용: 무료 (커스텀 도메인 구매는 선택사항) — 단, 아래 크레딧 주의사항 참고

### ⚠️ Netlify 무료 플랜 크레딧 주의 (2026-08-31 소진 경험함)
Netlify 무료 플랜은 월 **300 크레딧** 한도이고, **배포(deploy) 1회당 15 크레딧**을 소비한다. `/admin`에서 콘텐츠를 저장하든, 코드를 push하든 **커밋 1개 = 재배포 1회 = 15 크레딧**이다. 하루 세션에서 20여 개 커밋을 각각 push했다가 300 크레딧을 전부 소진해서 사이트가 다음 결제 주기까지 일시정지되는 일이 실제로 발생함(무료 플랜은 하드 리밋, 초과해도 재충전 안 됨, 롤오버도 없음).
- **그래서 앞으로는 자잘한 수정마다 바로 push하지 말고, 여러 수정을 모아서 한 번에 push할 것.** 로컬에서 여러 변경을 쌓아뒀다가 사용자가 확인 요청할 때 한 번에 커밋+push하는 식으로 진행
- `/admin`으로 콘텐츠 편집하는 것도 저장할 때마다 크레딧이 소모되므로, 여러 필드를 고칠 때는 한 번에 모아서 저장하는 게 좋다고 사용자에게 안내할 것
- 크레딧 리셋 시점은 Netlify 가입일 기준 결제 주기 시작일 (대시보드 → Billing에서 확인 가능)
- 급하게 반영이 필요한데 크레딧이 부족하면: Personal 플랜($9/월, 1000 크레딧)으로 업그레이드하거나 리셋을 기다려야 함

### Git Gateway 대신 GitHub OAuth를 쓰는 이유
Netlify Identity + Git Gateway로 진행하다가 Identity 대시보드가 정상 동작하지 않는 문제 발생. 원인은 private 저장소여서가 아니라 **Git Gateway가 Netlify에서 deprecated 상태**이기 때문(신규 설정 비권장, 버그 수정 중단). Identity 자체는 살아있지만 Git Gateway 연동에 문제가 있어, 여전히 정식 지원되는 GitHub OAuth 백엔드로 전환함. 설정법: ① GitHub에서 OAuth App 등록 (Authorization callback URL: `https://api.netlify.com/auth/done`) ② Netlify: Project configuration → Access & security → OAuth → GitHub에 Client ID/Secret 입력.

## 작업 워크플로우 (항상 지킬 것)
`/admin`(Decap CMS)에서 랩 멤버가 직접 콘텐츠를 수정하면 이 세션이 모르는 사이에 GitHub 레포에 새 커밋이 생긴다. 그래서 **로컬에서 뭔가를 수정하고 커밋하기 전에 항상 먼저 `git pull`로 최신 상태를 받아온 뒤 작업을 시작한다** — 순서: `git pull` → (필요시 원격에 새 커밋 있으면 무슨 내용인지 확인) → 로컬 수정 → 커밋 → push. 이렇게 하지 않으면 push가 거절되거나(non-fast-forward), 최악의 경우 CMS로 방금 바뀐 콘텐츠를 모르고 덮어쓸 수 있음.

**push는 아껴서 모아 할 것** (Netlify 크레딧 문제, 아래 참고) — 사용자가 명시적으로 push를 요청하거나, 여러 수정 사항을 다 마치고 확인받아야 할 시점이 됐을 때만 push. 자잘한 수정 하나 끝날 때마다 습관적으로 push하지 말 것.

## 현재 단계
**배포 스택 완성.** 랩 이름 확정, GitHub 조직(`m-ax-lab`)/레포(`lab-website`, public) 생성 및 push, Netlify 연결(https://m-ax-cybersecurity-lab.netlify.app/), GitHub OAuth App 등록 및 Netlify Access & security 연결, `/admin` 로그인까지 전부 확인 완료. 남은 건 실제 콘텐츠(구성원/논문/뉴스/연구 정보, 사진) 입력뿐.

## 콘텐츠/디자인 원칙
- 레이아웃(디자인) 코드와 콘텐츠(구성원, 논문, 뉴스, 사진 등)는 분리해서 관리 — 콘텐츠 파일만 수정하면 되도록 구성 (추후 Decap CMS 편집 대상)
- **화면에 보이는 텍스트는 원칙적으로 전부 CMS에서 수정 가능해야 함.** 새 페이지/섹션을 추가할 때 "이건 구조적 라벨이니 하드코딩해도 되겠지"라고 임의로 판단하지 말 것 — 섹션 제목, 이용구(eyebrow), 버튼 텍스트, 안내 문구까지 전부 `content/site.json`에 필드로 만들고 `admin/config.yml`에 노출시킬 것. 유일한 예외는 상단 네비게이션의 실제 링크 주소(href)/앵커 id 같은 구조 자체 — 이건 CMS로 텍스트만 바꾸게 하고 주소는 하드코딩 유지
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
- 콘텐츠 데이터: `content/site.json`(진짜 사이트 전역 정보만), `nav.json`(메뉴 라벨), `about.json`(About 페이지 전체: Welcome+Benefits+Contact), `people.json`, `research.json`, `publications.json`, `news.json` — 각 페이지가 자기 자신의 이용구/제목/설명 필드와 리스트를 함께 갖고 있는 구조 (CMS에서 페이지 하나 클릭하면 그 페이지 관련 내용이 다 보이도록). 이 파일들만 수정하면 사이트 전체 반영됨 (레이아웃 코드는 건드릴 필요 없음). `assets/js/main.js`가 이 파일들을 전부 fetch해서 하나로 합쳐 `data-site-field` 조회에 사용함(`SITE_FIELD_SOURCES` 배열)
- Decap CMS 설정: `admin/config.yml`(컬렉션 정의), `admin/index.html` — GitHub OAuth App을 Netlify에 연결하기 전까지는 작동 안 함
- 렌더링 로직: `assets/js/content.js`
- 로컬 미리보기: `.claude/launch.json` → `python3 -m http.server 5173`
- 랩 이름은 확정 반영됨(`content/site.json`), 구성원 중 지도교수(이대성)는 실제 정보 반영됨, 나머지 구성원/논문/뉴스 등은 아직 placeholder 상태
- 배너는 실사진이 아니라 CSS로 그린 보안/네트워크 느낌의 추상 SVG 패턴 (`assets/css/style.css`의 `.hero`). `site.json`의 `bannerImage`를 채우면 그 사진이 우선 적용되도록 되어 있음(현재는 비어있음)
- Research의 Facility/Project는 카드 클릭 시 모달로 사진+상세설명(`detail` 필드) 표시 (`assets/js/content.js`의 openDetailModal)
- People 표기는 영문 (역할 그룹명 및 개별 직함 모두)
- 콘텐츠 JSON은 전부 배열 구조 — Decap CMS 연결 시 list/folder collection으로 매핑하면 관리자 페이지에서 항목 추가/삭제가 자동 제공됨

## 테스트용 미리보기 (완료 및 제거됨)
로컬 프레임 확인 단계에서 Streamlit(`test/`) → GitHub Pages(`docs/`) 순으로 시도했으나, 실제 스택(GitHub 조직 + Netlify)이 연결된 뒤로는 불필요해져 `docs/`는 삭제함(2026-08-27). 참고 기록은 [PROJECT_NOTES.md](PROJECT_NOTES.md)에 있음.

## 톤/디자인 방향
한국해양대학교 해사인공지능보안학과(사이버보안전공) 소속에 맞는 톤 — 보안/공학 계열 연구실다운 신뢰감 있고 전문적인 느낌으로 진행 (세부 톤은 추후 확정).
