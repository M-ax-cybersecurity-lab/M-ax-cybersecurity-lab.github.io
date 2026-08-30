# 연구실 웹사이트 프로젝트

## 소속
- 학교: 한국해양대학교
- 학과: 해사인공지능보안학과 (사이버보안전공)
- 랩 이름: **해사 AX 보안공학 연구실** (영문: M-AX Cybersecurity Lab) — 확정됨 (2026-08-27), `content/site.json`의 labNameKo/labNameEn에 반영됨

## 배포 스택 (랩 이름 확정 후 연결)
- GitHub: 개인 계정이 아닌 **Organization(조직 계정)** 생성 후 그 아래 레포 생성 — 특정 개인이 나가거나 계정을 삭제해도 사이트가 유지되도록 함
- Netlify: 무료 티어로 호스팅
- Decap CMS: Netlify Identity + Git Gateway(둘 다 무료 티어)로 인증 연결, 랩 멤버가 로그인해서 콘텐츠/사진을 코드 수정 없이 편집
- 전체 스택 비용: 무료 (커스텀 도메인 구매는 선택사항)

## 현재 단계
랩 이름 확정 완료. 로컬 프레임 작업 및 GitHub Pages test 미리보기 완료. 지금부터 GitHub 조직 생성 → 레포 push → Netlify 연결 → Decap CMS 설정 진행 중.

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
- 콘텐츠 데이터: `content/site.json`, `people.json`, `research.json`, `publications.json`, `news.json` — 이 파일들만 수정하면 사이트 전체 반영됨 (레이아웃 코드는 건드릴 필요 없음)
- 렌더링 로직: `assets/js/content.js`
- 로컬 미리보기: `.claude/launch.json` → `python3 -m http.server 5173`
- 랩 이름은 확정 반영됨(`content/site.json`), 구성원/논문/뉴스 등은 아직 placeholder 상태
- Research의 Facility/Project는 카드 클릭 시 모달로 사진+상세설명(`detail` 필드) 표시 (`assets/js/content.js`의 openDetailModal)
- People 표기는 영문 (역할 그룹명 및 개별 직함 모두)
- 콘텐츠 JSON은 전부 배열 구조 — Decap CMS 연결 시 list/folder collection으로 매핑하면 관리자 페이지에서 항목 추가/삭제가 자동 제공됨

## 테스트용 미리보기 (본 배포 스택과 무관)
- [docs/](docs/) — **GitHub Pages용 test 디렉토리**. 저장소 push 후 Settings → Pages에서 Branch: main, Folder: /docs로 지정하면 `https://<계정>.github.io/<저장소명>/`에서 바로 확인 가능
- 사이트 원본의 스냅샷 복사본(경로만 상대경로로 변환)이라 원본 수정 시 자동 반영되지 않음 — 미리보기 갱신하려면 원본 파일들을 다시 복사해야 함
- (참고) 처음엔 Streamlit(`test/` 디렉토리)으로 시도했으나 클라우드 배포 시 화면이 제대로 안 보이는 문제가 있어 폐기하고 GitHub Pages 방식으로 전환함
- 실제 운영은 여전히 GitHub 조직 + Netlify + Decap CMS로 진행 (계획 변경 없음)

## 톤/디자인 방향
한국해양대학교 해사인공지능보안학과(사이버보안전공) 소속에 맞는 톤 — 보안/공학 계열 연구실다운 신뢰감 있고 전문적인 느낌으로 진행 (세부 톤은 추후 확정).
