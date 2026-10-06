# 닥코통닭발 공식 홈페이지

제작 명세 V3에 따른 모바일 우선 1페이지 정적 사이트입니다. 서버·DB·로그인 없이 HTML/CSS와 작은 메뉴·슬라이더 제어 스크립트만 배포합니다. 주요 콘텐츠와 Restaurant JSON-LD는 빌드 시 HTML에 포함됩니다.

## 로컬 개발

Node.js 22 이상 권장(현재 Node.js 24로 검증).

```sh
npm ci --cache /tmp/dakko-npm-cache
npm run dev
```

설정이나 스타일을 수정한 후 개발 서버를 다시 시작하면 `dist/`를 새로 생성합니다. 개발 서버는 생성된 정적 파일을 제공합니다.

```sh
npm test
npm run build
npm run preview
```

## 정보 수정

`src/site.config.js` 한 곳에서 연락처, URL, 메뉴/가격, 사진 경로와 기록을 관리합니다.

- `NAVER_PLACE_URL`, `NAVER_DIRECTIONS_URL`, `PHONE_NUMBER`
- `INSTAGRAM_URL`, `YOUTUBE_URL`, `GOOGLE_MAP_URL`
- `photos`: 실제 음식·매장·기록 사진만 사용. `public/images/`에 넣은 뒤 `/images/파일명.webp` 등으로 지정하세요. 빈 경로는 명시적 자리표시자로 표시됩니다. 첫 사진 외에는 지연 로딩합니다.
- `structuredAddress`, `openingHours`: 주소와 영업시간. HTML과 JSON-LD가 같은 설정을 읽습니다.
- `heroSlides`: 역사 → 오돌밥 → 숯불 → 야구 → 기록 순서. `photo`는 `photos`의 키를 참조합니다. 첫 사진은 우선 로딩합니다.
- `baseballArchive`: 확인된 사진·사인·설명을 추가할 수 있는 배열. 빈 배열이면 추가 아카이브를 노출하지 않습니다.
- `menus`: 가격은 확인된 숫자 또는 문자열로 입력. `null`이면 표시하지 않습니다.
- `records`: 확인된 기록만 추가. 방송 로고·캡처와 선수 사진은 사용권 확인 후 제공하세요.

빈 외부 링크는 `disabled` 버튼으로 표시합니다. HTTPS URL만 연결하며 새 창 링크에는 `noopener noreferrer`를 적용합니다. 실제 사진/선수 이름/후기/별점/가격을 임의로 만들지 않았습니다.

## 무료 배포

Cloudflare Pages나 Netlify에서 빌드 명령을 `npm run build`, 출력 디렉터리를 `dist`로 설정하면 됩니다. Netlify 설정은 `netlify.toml`에 있습니다. GitHub Pages 자동 배포 설정도 포함되어 있습니다.

무료 호스팅 주소를 발급받은 뒤 배포 환경의 `SITE_URL`에 실제 HTTPS 주소(끝에 `/`)를 설정하고 다시 빌드하세요. 예시 주소나 임의 도메인을 사이트에 넣지 않습니다.

`SITE_URL`이 설정되면 canonical, Open Graph URL, `sitemap.xml`의 홈페이지 주소와 `robots.txt`의 Sitemap 지시문이 자동 생성됩니다. 주소가 없으면 canonical은 생략하고 sitemap은 빈 유효 XML로 남깁니다. 향후 독립 도메인으로 바꿀 때에도 이 값만 바꾸고 다시 빌드하면 됩니다. 첫 HERO의 실제 사진을 설정하면 OG 이미지도 생성됩니다. 로컬 사진 경로는 SITE_URL을 기준으로 절대주소로 변환합니다.

Search Console에는 배포 후 실제 사이트 주소를 등록하고 `sitemap.xml`을 제출하세요. 소유권 인증 메타태그/파일은 발급받은 실제 값으로 추가해야 합니다.

## 구조와 확장

- `src/site.config.js`: 공식 정보와 메뉴/사진 데이터
- `scripts/build.mjs`: HTML·SEO 정적 생성기
- `src/style.css`: 모바일 우선 반응형 스타일
- `src/client.js`: 모바일 메뉴, HERO 슬라이더와 스크롤 후 하단 CTA
- `public/`: 그대로 배포할 정적 파일
- `tests/site.test.mjs`: 정적 콘텐츠와 설정 안전성 검증

홈페이지의 `#odolbap`, `#story`, `#menu`, `#records`는 독립 섹션입니다. 실제 콘텐츠가 축적되면 같은 데이터/생성기를 바탕으로 `/odolbap`, `/story`, `/menu`, `/media`를 추가할 수 있습니다. 현재 존재하지 않는 페이지 링크는 노출하지 않습니다.

## GitHub Pages

[GitHub Pages 클릭 순서 안내](GITHUB_PAGES.md)를 참고하세요. `main`에 push하면 `.github/workflows/deploy-pages.yml`이 테스트·정적 빌드·배포합니다. 저장소 **Settings → Pages → Source**는 **GitHub Actions**로 선택해야 합니다. 배포 시 공식 주소와 저장소 하위 경로를 자동 적용합니다.

## V3 HERO 슬라이더

사진이 없으면 실제 사진 준비 중 자리표시자를 유지합니다. `photos.history`, `photos.odolbap`, `photos.charcoal`, `photos.baseball`, `photos.media`에 사용 가능한 실제 사진을 설정하면 섹션과 슬라이더에 같이 반영됩니다. `photos.media`에 방송 자료를 넣기 전에 사용권을 확인하세요.

화면에 보이는 동안 5.5초마다 전환합니다. 이전/다음 버튼, 사진 선택, 좌우 방향키, Home/End 및 모바일 가로 스와이프를 지원합니다. 직접 조작하면 자동 전환을 멈추며 재생 버튼으로 다시 시작합니다. 마우스가 위에 있거나 키보드 포커스가 들어오면 잠시 멈추고, 화면 밖·숨겨진 탭에서도 전환하지 않습니다. 기기의 ‘움직임 줄이기’ 설정에서는 자동 재생과 전환 효과를 기본적으로 끕니다. 자바스크립트가 꺼져 있어도 첫 사진과 모든 공식 본문은 HTML로 읽을 수 있습니다.

페이지 순서: HERO → 닥코 이야기 → 오돌밥 → 메뉴·숯불 닭발 → 야구 이야기 → 기록 → 방문안내·네이버 CTA.
