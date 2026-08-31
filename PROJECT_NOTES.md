# 연구실 웹사이트 — 진행 노트

## 결정된 사항 (2026-08-27 기준)

### 소속
- 한국해양대학교 / 해사인공지능보안학과 (사이버보안전공)
- 랩 이름: 아직 미정 → 정해지면 GitHub 조직명/도메인/사이트명에 반영

### 왜 커스텀 사이트인가 (Google Sites 대신)
- Google Sites는 무료·간편하지만 디자인 자유도가 낮고 폼 기능도 제한적
- 커스텀 정적 사이트 + Decap CMS 조합이면, 디자인 자유도는 유지하면서 콘텐츠 수정은 코드 없이 폼으로 가능

### 유지보수 방식
- 레이아웃/디자인 코드와 콘텐츠(구성원, 논문, 뉴스, 사진)를 분리
- 추후 Decap CMS를 붙여서, 로그인 후 웹 폼으로 콘텐츠/사진 수정 → 자동으로 GitHub에 커밋 → Netlify가 자동 재배포
- 완전 무료 스택: GitHub(조직 계정) + Netlify(무료 티어) + Decap CMS(오픈소스) + Netlify Identity/Git Gateway(무료 티어)

### GitHub 계정 관련
- 개인 계정이 아니라 **Organization(조직)** 을 새로 만들어서 그 아래 레포 생성
- 이유: 특정 개인이 랩을 떠나거나 계정을 삭제해도 사이트 소유권/이력이 유지되도록 하기 위함
- 교수님/후임 학생들을 조직 멤버로 계속 추가 가능

### 진행 순서
1. (현재) 로컬에서 사이트 프레임 작업 — 랩 이름 확정 전이므로 placeholder로 진행
2. 랩 이름 확정 → GitHub 조직 생성 → 레포 push
3. Netlify 연결(배포)
4. Decap CMS 설정 (로그인/콘텐츠 편집 폼)
5. 도메인/이름 최종 반영

### 메뉴 구조
- About (Welcome, Contact us)
- People — 구성원별 이메일 클릭 시 gmail로 바로 연결 (별도 Contact 페이지 없음)
- Research (Areas, Projects, Facility)
- Publications
- News

### 톤/디자인
한국해양대학교 해사인공지능보안학과(사이버보안전공)에 맞는 신뢰감 있고 전문적인 보안/공학 연구실 톤. 세부 컬러/스타일은 추후 확정.

### 프레임 구현 현황 (2026-08-27)
- 순수 HTML/CSS/JS 정적 사이트로 구현 (빌드 툴 없음, Netlify에 그대로 배포 가능)
- 페이지: `index.html`(About: Welcome+Contact), `people.html`, `research.html`(Areas/Projects/Facility 앵커), `publications.html`, `news.html`
- 공통 헤더/푸터: `assets/partials/header.html`, `footer.html` — `assets/js/main.js`가 fetch로 불러와 삽입, 모바일 햄버거 메뉴 포함
- 콘텐츠는 전부 `/content/*.json`에 분리 (site.json, people.json, research.json, publications.json, news.json) — 추후 Decap CMS가 이 파일들을 편집 대상으로 삼음
- `assets/js/content.js`가 JSON을 읽어 각 페이지에 렌더링
- 랩 이름 등은 아직 placeholder("OOO 연구실" 등)이며 `content/site.json`, `content/people.json` 값만 바꾸면 전체 사이트에 반영됨
- 로컬 미리보기: `.claude/launch.json`에 `python3 -m http.server 5173` 설정해둠

### 추가 반영 (2026-08-27)
- Research의 Facility/Project 카드를 클릭하면 모달(팝업)로 사진 + 상세 설명(`detail` 필드)을 볼 수 있도록 구성 — `content/research.json`의 facility/projects 항목에 `image`, `detail` 필드 추가
- People 페이지 표기를 영문으로 변경 (역할 그룹명: PI/Ph.D. Student/M.S. Student/Alumni, 각 구성원 이름·직함도 영문)
- 콘텐츠 JSON 파일들은 배열(list) 구조이므로, 추후 Decap CMS 연결 시 그대로 "list"/"folder collection" 위젯으로 매핑하면 관리자 페이지에서 항목 추가("+ Add")·삭제(휴지통 아이콘)가 기본 제공됨 — 별도 코드 작업 불필요, CMS 설정(config.yml)만 하면 됨

### 테스트용 미리보기 (2026-08-27, 본 배포와 무관)
- 처음엔 [test/](test/) 디렉토리에 Streamlit 뷰어를 만들어 시도했으나(Streamlit Community Cloud에서 `test/app.py` 배포), 실제 클라우드 배포 시 화면이 제대로 안 보이는 문제가 발생 → 폐기
- 순수 정적 사이트 미리보기에는 **GitHub Pages가 더 간단하고 안정적**이라 판단, [docs/](docs/) 폴더로 전환 (사이트 원본 복사본, 경로만 상대경로로 변환 — GitHub Pages 프로젝트 페이지가 `https://<계정>.github.io/<저장소명>/`처럼 하위 경로에서 서빙되기 때문)
- 저장소 push 후 Settings → Pages에서 Source: Deploy from a branch, Branch: main, Folder: /docs로 지정하면 확인 가능. 로컬 정적 서버로 index.html/CSS/JS/JSON 전부 200 OK 확인 완료
- **주의**: `docs/`는 원본의 스냅샷(복사본)이라 원본을 고쳐도 자동 반영 안 됨 — 미리보기 갱신하려면 다시 복사 필요. 실제 운영/CMS 연결은 여전히 GitHub 조직 + Netlify + Decap CMS 스택으로 진행 (이 test는 순수 확인용)
- **(2026-08-27) test 단계 종료 확정.**
- **랩 이름 확정**: 해사 AX 보안공학 연구실 / M-AX Cybersecurity Lab → `content/site.json`에 반영, 헤더/푸터/About 페이지의 fallback 텍스트도 갱신
- **Decap CMS 연결 준비**: `people.json`, `benefits.json`, `news.json`, `publications.json`을 배열 단독 구조에서 `{ "people": [...] }` 형태의 객체로 감싸도록 변경 (Decap의 "file collection"이 파일을 항상 필드명으로 감싸서 저장하기 때문 — `research.json`은 원래부터 `{areas, projects, facility}` 객체라 변경 불필요). `assets/js/content.js`의 fetch 처리도 이에 맞춰 수정, 로컬에서 재검증 완료
- `admin/config.yml`, `admin/index.html` 생성 완료 (Decap CMS 관리자 화면 설정 — site/people/research/benefits/publications/news 6개 컬렉션 매핑)
- 로컬 git 저장소 초기화 + 첫 커밋 완료 (`main` 브랜치). GitHub 조직(`m-ax-lab`)/레포(`lab-website`) 생성 및 push, Netlify 연결(배포)까지 완료 (사용자 진행)

### 배포 스택 방향 전환: Git Gateway → GitHub OAuth 백엔드 (2026-08-27)
- Netlify Identity+Git Gateway로 진행하던 중, Netlify Identity 대시보드가 정상 동작하지 않는 문제 발생 (private 저장소 때문이 아니었음)
- 원인 확인: **Git Gateway가 Netlify에서 deprecated 상태** (신규 설정 비권장, 버그 수정 중단 — 기존에 이미 켜져 있던 사이트만 계속 동작). Netlify Identity 자체는 살아있지만 Git Gateway 연동이 문제
- 그래서 Decap CMS 백엔드를 **Git Gateway 대신 GitHub OAuth 방식**으로 전환하기로 결정 — Netlify가 여전히 정식 지원하는 방식이고, Identity 가입/초대 절차 없이 GitHub 계정으로 바로 로그인하는 방식이라 오히려 더 간단함
- `admin/config.yml`의 backend를 `{name: github, repo: m-ax-lab/lab-website, branch: main}`으로 변경, `index.html`/`admin/index.html`에서 Netlify Identity 위젯 스크립트 제거
- **남은 설정 (Netlify 대시보드에서 진행)**:
  1. GitHub에서 OAuth App 등록 (Settings → Developer settings → OAuth Apps → New OAuth App), Authorization callback URL은 `https://api.netlify.com/auth/done`
  2. Netlify: Project configuration → Access & security → OAuth → GitHub 선택 → 방금 만든 Client ID/Secret 입력
  3. `https://<사이트주소>/admin`에서 "Login with GitHub"으로 로그인 확인
- GitHub Pages test용 `docs/` 폴더는 test 단계 종료로 사용자가 직접 삭제함

### 다음 단계
GitHub OAuth App 등록 → Netlify Access & security에 연결 → `/admin` 로그인 확인 → 실제 콘텐츠(구성원/논문/사진 등) 입력

### 참고 사이트
[ref_link/link.md](ref_link/link.md) 참고 — 특히 `lab.wschoi.com`의 메일 바로 발송되는 문의 폼 형태 참고할 만함.
