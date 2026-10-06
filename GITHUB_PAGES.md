# GitHub Pages로 공개하기

홈페이지와 자동 배포 설정이 GitHub의 `main` 브랜치에 업로드되어 있습니다.

1. https://github.com/jeminai336-blip/dakko-website 를 열고 로그인합니다.
2. 저장소 상단 **Settings**를 클릭합니다. 보이지 않으면 상단 **…** 메뉴를 확인하세요.
3. 왼쪽 **Code and automation → Pages**를 클릭합니다.
4. **Build and deployment → Source**에서 **GitHub Actions**를 선택합니다. Branch를 고르는 방식이 아닙니다.
5. 상단 **Actions**를 클릭합니다.
6. 왼쪽 **Deploy website to GitHub Pages**를 선택합니다.
7. 오른쪽 **Run workflow**를 클릭하고 브랜치 **main**을 선택한 뒤 초록색 **Run workflow**를 클릭합니다. 처음에는 워크플로 목록이 나타날 때까지 새로고침이 필요할 수 있습니다.
8. 새 실행을 클릭합니다. **build**, **deploy**가 모두 초록색 체크가 되면 배포가 완료된 것입니다.
9. 실행 화면의 **deploy** 링크 또는 **Settings → Pages → Visit site**를 클릭합니다.

기본 접속 주소:

https://jeminai336-blip.github.io/dakko-website/

이 주소는 배포 성공 후 접속할 수 있습니다. 배포 전 또는 적용 직후에는 404가 표시될 수 있습니다. 기존 custom domain 설정이 있다면 실제 주소는 **Visit site**에서 확인하세요.

## 메뉴가 없거나 실행이 실패할 때

- 무료 GitHub 계정에서 private 저장소의 Pages를 사용할 수 없다면 **Settings → General → Danger Zone → Change repository visibility → Change to public**에서 공개 저장소로 전환해야 합니다. 저장소 소스도 공개됩니다. 공개를 원하지 않으면 다른 무료 정적 호스팅을 선택하세요.
- Actions가 비활성화되어 있으면 **Settings → Actions → General**에서 GitHub 공식 Actions 실행을 허용하고 저장하세요. 조직 정책으로 제한되면 관리자에게 문의하세요.
- `Get Pages site failed` / Pages 관련 404: **Settings → Pages → Source → GitHub Actions**를 먼저 설정하고, 실패한 실행의 **Re-run all jobs**를 누르세요.
- Actions의 초록색 체크 없이 홈페이지가 배포되었다고 판단하지 마세요. 실패한 실행을 클릭하면 원인 로그를 볼 수 있습니다.

## 다음 수정부터

`main` 브랜치에 변경을 올릴 때마다 자동으로 테스트·빌드·배포합니다. 전화, 사진, URL은 `src/site.config.js`에서 수정하세요. 이미지 파일은 `public/images/`에 업로드하세요. 소스를 수정한 뒤 main에 커밋하면 됩니다.

GitHub Pages 주소는 워크플로가 자동으로 `SITE_URL`에 전달합니다. canonical과 sitemap, CSS/JS/이미지의 저장소 하위 경로가 자동 생성됩니다. 별도 토큰·유료 도메인·서버는 필요하지 않습니다.

현재 배포 설정 파일은 `.github/workflows/deploy-pages.yml`입니다. 출력은 `dist/`이며 산출물 업로드/배포 방식이라 `gh-pages` 브랜치는 필요하지 않습니다.

프로젝트 사이트의 robots.txt는 `/dakko-website/robots.txt`에 배포됩니다. 검색엔진의 robots 규칙은 호스트 루트가 기준이므로 이 파일이 호스트 전체 정책을 제어하지는 않습니다. Search Console에는 실제 사이트 주소와 `/dakko-website/sitemap.xml`을 등록하세요.
