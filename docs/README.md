# GitHub Pages 테스트용 폴더

이 폴더는 GitHub Pages로 지금 사이트를 빠르게 웹에서 확인하기 위한 복사본입니다. Streamlit보다 순수 정적 사이트 미리보기에는 이 방식이 더 간단하고 안정적입니다.

원본(`../index.html`, `../assets/`, `../content/` 등)과 내용은 같지만, 경로가 `/assets/...`가 아니라 `assets/...`처럼 상대경로로 되어 있습니다. GitHub Pages 프로젝트 페이지는 `https://<계정>.github.io/<저장소명>/`처럼 하위 경로에서 서빙되기 때문입니다.

**주의**: 이 폴더는 스냅샷(복사본)이라 원본을 수정해도 자동 반영되지 않습니다. 갱신이 필요하면 다시 복사해야 합니다.

## GitHub Pages 활성화 방법
1. 이 저장소를 GitHub에 push
2. 저장소 → Settings → Pages
3. Source: "Deploy from a branch" 선택
4. Branch: `main`(또는 사용 중인 브랜치), Folder: `/docs` 선택 후 저장
5. 잠시 후 `https://<계정>.github.io/<저장소명>/` 에서 확인 가능
