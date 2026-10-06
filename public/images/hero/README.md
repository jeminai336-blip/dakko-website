# HERO 슬라이더 실제 사진 저장 폴더

실제 이미지는 아직 없습니다. 이 문서가 폴더를 Git에 보존합니다.
사진을 임의 생성하거나 가짜 이미지 파일을 추가하지 마세요.

| 슬라이드 | 사진 내용 | 이 폴더에 넣을 파일명 | 설정 키 |
| --- | --- | --- | --- |
| 1 | 오래된 매장·간판·역사 | `01-history.webp` | `photos.history` |
| 2 | 실제 오돌밥 | `02-odolbap.webp` | `photos.odolbap` |
| 3 | 숯불에서 닭발을 굽는 모습 | `03-charcoal.webp` | `photos.charcoal` |
| 4 | 매장에 남은 실제 선수 사진·사인 | `04-baseball.webp` | `photos.baseball` |
| 5 | 사용권이 확인된 방송·기록 자료 | `05-media.webp` | `photos.media` |

## 현재 상태

`src/site.config.js`의 각 `photos` 항목에 `localSrc`로 예정 경로만 등록했습니다.
실제 표시 여부는 기존 `src` 값으로 결정합니다. 현재 모든 `src`는 빈 문자열이므로
홈페이지와 HERO 5장 모두 기존 placeholder를 유지합니다.
`localSrc`는 경로 안내용이며 자동으로 이미지를 불러오지 않습니다.

## 나중에 사진을 연결하는 방법

1. 실제 사진을 위 파일명으로 이 폴더에 업로드합니다. 확장자는 실제 파일 형식과 일치해야 합니다. JPG/PNG를 사용하면 파일명과 아래 경로도 해당 확장자로 바꾸세요.
2. `src/site.config.js`에서 해당 항목의 `src`에 `localSrc`와 같은 경로를 입력합니다.
   예: `src: '/images/hero/01-history.webp'`.
3. 사진 내용과 일치하도록 같은 항목의 `alt`를 확인합니다.
4. `npm test`와 `npm run build`를 실행한 뒤 `main`에 반영합니다.

현재 HERO는 해당 사진 설정을 본문 섹션과 공유하므로 `src`를 설정하면 해당 본문 사진도 함께 연결됩니다.
GitHub Pages의 `/dakko-website/` 접두사는 기존 빌드가 자동 처리합니다.
설정에는 `/images/hero/...`만 입력하고 `/public/`이나 `/dakko-website/`를 직접 붙이지 마세요.
첫 HERO 사진 우선 로딩, 나머지 사진 지연 로딩과 기존 슬라이더 기능은 그대로 적용됩니다.
방송 캡처·로고, 선수 사진은 실제 자료와 사용권 확인 후 추가하세요.
