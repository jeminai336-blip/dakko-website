// 확인되지 않은 연락처·URL은 빈 값으로 유지하세요. 배포 주소는 SITE_URL로 설정할 수도 있습니다.
export const site = {
  name: '닥코통닭발', founded: '1996',
  title: '닥코통닭발 | 1996년부터 이어온 동암역 숯불 닭발과 오돌밥',
  description: '1996년부터 이어온 인천 동암역 닥코통닭발. 주문 후 숯불에 직접 구워내는 닭발과 야구선수들이 찾아 먹던 오돌밥, 닥코의 30년 이야기를 소개합니다.',
  SITE_URL: '',
  NAVER_PLACE_URL: '', NAVER_DIRECTIONS_URL: '', PHONE_NUMBER: '',
  INSTAGRAM_URL: '', YOUTUBE_URL: '', GOOGLE_MAP_URL: '',
  station: '동암역 2번 출구 북광장 인근',
  // 주소·영업시간은 화면과 JSON-LD가 같은 데이터에서 읽습니다.
  structuredAddress: { streetAddress: '동암광장로8번길 5 조은빌딩 101호', addressLocality: '부평구', addressRegion: '인천', addressCountry: 'KR' },
  lastOrder: '22:30', closed: '매주 일요일',
  openingHours: { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '17:00', closes: '23:00' },
  // localSrc는 실제 사진을 넣을 예정 경로입니다. 업로드 전에는 src를 비워 placeholder를 유지합니다.
  // 사진 업로드 후 해당 src에 localSrc와 같은 경로를 입력하면 기존 렌더러가 이미지를 표시합니다.
  photos: {
    hero1: { src: '/images/hero/main 1.png', alt: '불과 연기가 올라오는 석쇠 위 닭발과 아래의 30년 전통 1996 간판' },
    hero2: { src: '/images/hero/main 2.png', alt: '생활의 달인 1024회 소개 자료와 닥코통닭발 매장 입구' },
    hero3: { src: '/images/hero/main 3.png', alt: '야구공과 선수 사진, 여러 장의 사인이 걸린 닥코 매장 벽' },
    hero4: { src: '/images/hero/main 4.png', alt: '접시 위 닭발을 배경으로 젓가락으로 들어 올린 양념 통닭발' },
    hero5: { src: '/images/hero/main 5.png', alt: '깨가 뿌려진 닭발과 양념 오돌뼈, 김이 함께 놓인 상' },
    odolbap: { src: '', localSrc: '/images/hero/02-odolbap.webp', alt: '양념한 오돌뼈와 밥을 비빈 닥코의 오돌밥' },
    wrap: { src: '', alt: '김 위에 오돌밥을 올려 싸 먹는 모습' },
    history: { src: '', localSrc: '/images/hero/01-history.webp', alt: '닥코통닭발의 오래된 간판과 매장 기록' },
    charcoal: { src: '', localSrc: '/images/hero/03-charcoal.webp', alt: '숯불에 구워내는 닥코통닭발' },
    baseball: { src: '', localSrc: '/images/hero/04-baseball.webp', alt: '매장에 남아 있는 야구선수 사진과 사인' },
    media: { src: '', localSrc: '/images/hero/05-media.webp', alt: '사용권이 확인된 닥코통닭발의 방송 소개 관련 기록' },
  },
  // HERO 전용 사진: 본문 섹션의 photos 설정과 분리합니다.
  heroSlides: [
    { photo: 'hero1', label: '30년', caption: '숯불 위의 닭발, 1996년부터 이어온 맛', objectPosition: '50% 100%', mobileObjectPosition: '50% 100%', objectFit: 'cover' },
    { photo: 'hero2', label: '기록', caption: 'SBS 「생활의 달인」에 소개된 닥코', objectPosition: '50% 50%', mobileObjectPosition: '50% 50%', objectFit: 'contain' },
    { photo: 'hero3', label: '야구', caption: '매장에 쌓인 야구 사진과 사인', objectPosition: '45% 50%', mobileObjectPosition: '40% 50%', objectFit: 'contain' },
    { photo: 'hero4', label: '숯불', caption: '한 입에 만나는 숯불 통닭발', objectPosition: '50% 45%', mobileObjectPosition: '50% 40%', objectFit: 'contain' },
    { photo: 'hero5', label: '한 상', caption: '닭발과 오돌뼈, 함께 곁들이는 김', objectPosition: '55% 50%', mobileObjectPosition: '55% 50%', objectFit: 'contain' },
  ],
  // 확인된 사진·사인·설명이 생기면 항목을 추가합니다. 선수 이름·날짜를 추측하지 마세요.
  baseballArchive: [], // { photo: 'photos의 키', title: '확인된 제목', description: '확인된 내용', date: '확인된 날짜(선택)' }
  menus: [
    { category: '처음 오셨다면', name: '오돌밥 + 닭발', description: '양념한 오돌뼈와 밥을 비벼 김에 싸 먹는 닥코의 대표 메뉴.', price: null },
    { category: '닥코의 본질', name: '숯불 통닭발 · 무뼈닭발', variants: ['숯불 통닭발', '숯불 무뼈닭발'], description: '주문 후 숯불에 직접 구워내는 닭발. 취향에 맞게 골라주세요.', price: null },
    { category: '여럿이 함께라면', name: '닭도리탕 · 곱도리탕', description: '여럿이 둘러앉아 함께 즐기는 메뉴.', price: null },
    { category: '함께 즐기기', name: '세트 · 사이드', description: '구성과 가격은 최신 메뉴판에서 확인해주세요.', price: null },
  ],
  records: [{ broadcaster: 'SBS', program: '생활의 달인', episode: '1024회', title: '야구장 맛집 소개', date: '2026-03-30' }],
};
