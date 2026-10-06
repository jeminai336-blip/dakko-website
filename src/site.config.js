// 확인되지 않은 연락처·URL은 빈 값으로 유지하세요. 배포 주소는 SITE_URL로 설정할 수도 있습니다.
export const site = {
  name: '닥코통닭발', founded: '1996',
  title: '닥코통닭발 | 1996년부터 이어온 동암역 숯불 닭발과 오돌밥',
  description: '1996년부터 이어온 인천 동암역 닥코통닭발. 주문 후 숯불에 직접 구워내는 닭발과 야구선수들이 찾아 먹던 오돌밥을 소개합니다.',
  SITE_URL: '',
  NAVER_PLACE_URL: '', NAVER_DIRECTIONS_URL: '', PHONE_NUMBER: '',
  INSTAGRAM_URL: '', YOUTUBE_URL: '', GOOGLE_MAP_URL: '',
  address: '인천 부평구 동암광장로8번길 5 조은빌딩 101호',
  station: '동암역 2번 출구 북광장 인근',
  hours: '17:00 ~ 23:00', lastOrder: '22:30', closed: '매주 일요일',
  photos: {
    hero: { src: '', alt: '숯불에서 주문한 닭발을 직접 굽는 모습' },
    odolbap: { src: '', alt: '양념한 오돌뼈와 밥을 비빈 닥코의 오돌밥' },
    wrap: { src: '', alt: '김 위에 오돌밥을 올려 싸 먹는 모습' },
    history: { src: '', alt: '닥코통닭발의 오래된 간판과 매장 기록' },
    charcoal: { src: '', alt: '숯불에 구워내는 닥코통닭발' },
    baseball: { src: '', alt: '매장에 남아 있는 야구선수 사진과 사인' },
  },
  menus: [
    { category: '처음 오셨다면', name: '오돌밥', description: '양념한 오돌뼈와 밥을 비벼 김에 싸 먹는 닥코의 대표 메뉴.', price: null },
    { category: '닥코의 본질', name: '숯불 통닭발 · 무뼈닭발', description: '주문 후 숯불에 직접 구워내는 닭발. 취향에 맞게 골라주세요.', price: null },
    { category: '여럿이 함께라면', name: '닭도리탕 · 곱도리탕', description: '여럿이 둘러앉아 함께 즐기는 메뉴.', price: null },
    { category: '함께 즐기기', name: '세트 · 사이드', description: '구성과 가격은 최신 메뉴판에서 확인해주세요.', price: null },
  ],
  records: [{ broadcaster: 'SBS', program: '생활의 달인', episode: '1024회', title: '야구장 맛집 소개', date: '2026-03-30' }],
};
