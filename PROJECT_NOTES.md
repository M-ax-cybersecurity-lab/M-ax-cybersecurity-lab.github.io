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

### 배포 스택 완성 (2026-08-27)
- GitHub 조직 `m-ax-lab` / 레포 `lab-website` (public 전환 완료 — Netlify 무료 플랜은 조직 소유 private 레포 배포를 지원 안 해서 public으로 전환함, 소스에 민감정보 없음 확인함)
- Netlify 배포 완료: https://m-ax-cybersecurity-lab.netlify.app/ — Visitor access를 Public으로 변경함 (2026-07-28부터 신규 팀은 기본 Private로 시작되는 정책 때문에 처음엔 팀 로그인 없이 접속 불가였음)
- GitHub OAuth App 등록 + Netlify Access & security에 연결 완료, `/admin` 로그인 확인 완료 → **기본 세팅 끝**
- 동작 방식: `/admin`에서 콘텐츠 수정 후 Publish → Decap CMS가 레포에 자동 커밋 → Netlify가 감지해서 자동 재배포

### 실제 콘텐츠 입력 시작 (2026-08-27)
- **People**: 이대성 교수님 실제 정보 반영 ([학과 교수 소개 페이지](https://www.kmou.ac.kr/aisec/ad/tepDept/main/view.do?mi=4916&teaSn=4740)에서 가져옴) — 학력/경력/연구분야는 `cv` 필드에 담아 카드 클릭 시 모달로 표시됨
- **배너**: 처음엔 KMOU 공식 홈페이지의 캠퍼스 항공사진("2025년 대학전경")을 다운로드해 적용했으나, 연구실과 무관하게 전경만 나온 느낌이라는 피드백으로 폐기. 대신 사이트 톤(네이비·시안)에 맞는 **보안/네트워크 느낌의 추상 SVG 패턴**을 히어로 배경에 적용 (`assets/css/style.css`의 `.hero` — data URI SVG, 원, 대각선으로 회로/네트워크 느낌 표현). 다운로드했던 사진 파일은 삭제함. `content/site.json`의 `bannerImage` 필드는 비워둔 채 유지 — 나중에 실제 사진을 쓰고 싶으면 CMS에서 업로드 시 이 패턴 대신 사진이 적용됨

### 스택 전면 전환: Netlify+Decap CMS → GitHub Pages (2026-08-31)
- **계기**: Netlify 무료 플랜 크레딧(월 300, 배포당 15) 소진 문제 발생 — 세션 하나에서 20여 개 커밋을 각각 push하다 다 써버려서 사이트가 일시정지됨
- 크레딧 문제는 "여러 수정을 모아서 한 번에 push/저장"하는 습관으로 완화 가능하다고 설명했으나, 이어서 팀 인계(사용자가 랩을 그만둘 경우) 문제도 확인함 → Netlify Free/Personal 플랜은 팀 멤버 추가가 안 되고 Pro($20/월)부터 가능하다는 것 확인
- 다만 콘텐츠 편집 권한(Decap CMS `/admin` 로그인)은 Netlify 시트가 아니라 GitHub 조직 멤버십으로 제어되고 있어서 이미 무료로 인계 가능한 상태였음(설명함)
- 그럼에도 사용자가 "차라리 GitHub만 쓰고 GitHub Pages로 하자, 어차피 content 파일만 수정하면 되니까 관리자 페이지(OAuth 포함)도 필요 없다"고 판단 → **Netlify, Decap CMS 전부 제거하고 GitHub Pages로 전환하기로 결정**
- **새 GitHub 계정**: 기존 조직 `m-ax-lab` 대신, 사용자가 **공용 계정**(Organization 아닌 일반 User 계정) `M-ax-cybersecurity-lab`을 새로 생성 — 여러 사람이 로그인 정보를 공유해서 쓰는 방식으로 인계 문제 해결하기로 함
- **레포 이름을 계정 이름과 동일하게**(`M-ax-cybersecurity-lab.github.io`) 설정 — GitHub Pages가 이 특수 이름을 루트 도메인(`https://m-ax-cybersecurity-lab.github.io/`)으로 서빙해줌
- **SSH 키**: 이 작업 환경(서버)에 새 계정 전용 SSH 키(`~/.ssh/id_ed25519_maxlab`)를 새로 생성해서 공개키를 새 계정에 등록, `~/.ssh/config`에 `github-maxlab` 호스트 별칭으로 등록해서 기존 개인 계정 키와 분리해서 사용
- **파일 구조 변경**: 실제 사이트 파일(`index.html`, `assets/`, `content/`, `images/` 등)을 저장소 루트에서 `docs/` 폴더 안으로 이동 (GitHub Pages Folder: /docs 설정과 맞춤 — 이 계정/레포 조합은 특수 루트 도메인이라 상대/절대 경로 변환 없이 기존 절대경로(`/assets/...`)를 그대로 써도 됨). `admin/`(Decap CMS 설정) 삭제
- 기존 Netlify 사이트(`m-ax-cybersecurity-lab.netlify.app`)는 그대로 방치해도 비용 없음(더는 안 씀), 필요하면 나중에 삭제
- **콘텐츠 편집은 이제 CMS 없이** — GitHub 웹 UI에서 `docs/content/*.json` 직접 편집하거나, 로컬에서 고쳐서 push

### 다음 단계
사용자가 GitHub Settings → Pages에서 Branch: main, Folder: /docs로 활성화 확인. 이후 나머지 콘텐츠(구성원 추가, 논문, 뉴스, 연구 프로젝트, 시설 사진 등)는 `docs/content/*.json`을 직접 수정해서 반영

### 참고 사이트
[ref_link/link.md](ref_link/link.md) 참고 — 특히 `lab.wschoi.com`의 메일 바로 발송되는 문의 폼 형태 참고할 만함.
