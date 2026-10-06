# HERO 사진

업로드된 실제 파일을 이름 순서대로 HERO 전용 설정에 연결했습니다.

| 슬라이드 | 파일 | 사진 내용 | 설정 |
| --- | --- | --- | --- |
| 1 | `main1.png` | 숯불 닭발과 30년 전통 1996 간판 | `photos.hero1` |
| 2 | `main2.png` | 생활의 달인 소개 자료와 매장 입구 | `photos.hero2` |
| 3 | `main3.png` | 야구공·사진·사인이 걸린 매장 벽 | `photos.hero3` |
| 4 | `main4.png` | 젓가락으로 들어 올린 통닭발 | `photos.hero4` |
| 5 | `main5.png` | 닭발·양념 오돌뼈·김이 놓인 상 | `photos.hero5` |

`src/site.config.js`의 `photos.hero1`~`hero5`에서 경로와 alt를,
`heroSlides`에서 caption, PC `objectPosition`, 모바일 `mobileObjectPosition`, `objectFit`을 관리합니다.
방송 자료·사인·음식 전체가 잘리지 않도록 필요한 사진에는 `contain`을 사용합니다.
기존 사진 영역 크기와 슬라이더 기능은 유지합니다.

HERO 전용 키이므로 본문 섹션의 사진 설정과 연결되지 않습니다.
본문용 `history`, `odolbap`, `charcoal`, `baseball`, `media`는 아직 placeholder 상태입니다.

설정 경로는 `/images/hero/main1.png` 형식입니다. GitHub Pages 접두사는 빌드에서 자동 추가하고
파일명에는 공백이 없습니다. 실제 파일명과 확장자를 그대로 사용하세요.

사진 교체 시 실제 사진과 사용 가능한 자료만 사용하고 alt·caption도 함께 확인하세요.
첫 사진은 우선 로딩하고, 나머지 사진은 지연 로딩합니다.
