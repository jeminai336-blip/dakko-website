import { mkdir, writeFile, copyFile, cp } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { site } from '../src/site.config.js';
const root = fileURLToPath(new URL('../', import.meta.url));
const out = path.join(root, 'dist');
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function safeUrl(value) {
  if (!value) return null;
  try { const u = new URL(value); return u.protocol === 'https:' ? u.href : null; } catch { return null; }
}
export function render(config = site) {
 const e = esc;
 const base = safeUrl(process.env.SITE_URL || config.SITE_URL);
 const canonical = base ? `${base.replace(/\/$/, '')}/` : null;
 const assetBase = canonical ? new URL(canonical).pathname : '/';
 const asset = value => value.startsWith('/') && !value.startsWith('//') ? `${assetBase}${value.slice(1)}` : value;
 const photo = (key, label, eager = false) => {
   const p = config.photos[key];
   // 로컬 public 경로나 검증된 HTTPS 사진만 허용합니다.
   const src = p.src && (/^\/(?!\/)/.test(p.src) || safeUrl(p.src));
   return src ? `<img src="${e(asset(p.src))}" alt="${e(p.alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">` : `<div class="photo-placeholder" role="img" aria-label="${e(p.alt)} — 실제 사진 준비 중"><span class="photo-mark" aria-hidden="true">▧</span><span>${e(label)}</span><small>실제 사진 준비 중</small></div>`;
 };
 const cta = (key, label, cls='button', arrow=true) => safeUrl(config[key]) ? `<a class="${cls}" href="${e(safeUrl(config[key]))}" target="_blank" rel="noopener noreferrer">${e(label)}${arrow?'<span aria-hidden="true">↗</span>':''}<span class="sr-only"> (새 창)</span></a>` : `<button class="${cls} unavailable" type="button" disabled>${e(label)}<span class="pending">연결 준비 중</span></button>`;

 const schema = {
  '@context':'https://schema.org', '@type':'Restaurant', name:config.name, description:config.description,
  foundingDate: config.founded, servesCuisine:'한식',
  address:{'@type':'PostalAddress',streetAddress:'동암광장로8번길 5 조은빌딩 101호',addressLocality:'부평구',addressRegion:'인천',addressCountry:'KR'},
  openingHoursSpecification:[{'@type':'OpeningHoursSpecification',dayOfWeek:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],opens:'17:00',closes:'23:00'}],
  ...(canonical?{url:canonical}:{}),
  ...(config.PHONE_NUMBER?{telephone:config.PHONE_NUMBER}:{}),
  ...(safeUrl(config.INSTAGRAM_URL)||safeUrl(config.YOUTUBE_URL)?{sameAs:[config.INSTAGRAM_URL,config.YOUTUBE_URL].map(safeUrl).filter(Boolean)}:{}),
 };
 return `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(config.title)}</title><meta name="description" content="${e(config.description)}"><meta name="theme-color" content="#f5f0e7"><meta property="og:type" content="website"><meta property="og:locale" content="ko_KR"><meta property="og:site_name" content="${e(config.name)}"><meta property="og:title" content="${e(config.title)}"><meta property="og:description" content="${e(config.description)}">${canonical?`<link rel="canonical" href="${e(canonical)}"><meta property="og:url" content="${e(canonical)}">`:''}${safeUrl(config.photos.hero.src)?`<meta property="og:image" content="${e(config.photos.hero.src)}">`:''}<link rel="icon" href="${e(asset('/favicon.svg'))}" type="image/svg+xml"><link rel="stylesheet" href="${e(asset('/style.css'))}"><script type="application/ld+json">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script><script src="${e(asset('/client.js'))}" defer></script></head>
<body><a class="skip" href="#main">본문으로 바로가기</a>
<header class="header"><div class="wrap header-inner"><a href="#" class="logo" aria-label="닥코통닭발 홈"><span class="logo-seal">닥코</span><span class="logo-type">통닭발<small>동암역 · SINCE 1996</small></span></a><button class="menu-toggle" type="button" aria-label="메뉴 열기" aria-expanded="false" aria-controls="navigation"><span></span><span></span></button><nav id="navigation" class="nav" aria-label="주 메뉴"><a href="#odolbap">오돌밥이란?</a><a href="#story">1996부터 이어온 이야기</a><a href="#menu">메뉴</a><a href="#visit">방문 안내</a></nav><a class="header-visit" href="#visit">닥코 찾아가기 <span aria-hidden="true">↗</span></a></div></header>
<main id="main">
<section class="hero wrap" aria-labelledby="hero-title"><div class="hero-copy"><p class="eyebrow"><span class="red-dot"></span> 인천 동암역, 1996년부터</p><h1 id="hero-title">1996년부터<br><span class="red">30년째 이어온</span><br>닭발집, 닥코통닭발</h1><p class="hero-description">주문 후 숯불에 직접 구워내는 닭발.<br>야구선수들이 찾아 먹던 오돌밥.<br>오래 이어온 맛과 이야기를 만나보세요.</p><div class="hero-actions"><a class="button" href="#odolbap">오돌밥이 뭔가요? <span aria-hidden="true">↓</span></a>${cta('NAVER_PLACE_URL','네이버에서 닥코 확인하기','button outline')}</div><p class="hero-note">동암역 2번 출구 북광장 인근</p></div><div class="hero-photo">${photo('hero','숯불에서 시작되는 닥코의 맛',true)}<div class="since-badge"><small>SINCE</small><strong>1996</strong><span>두 세대가 이어온 맛</span></div><span class="photo-caption">불 앞에서, 주문 한 접시마다.</span></div></section>
<div class="heritage-strip"><div class="wrap"><span>1996년 시작</span><span aria-hidden="true">·</span><span>현재 2대째 운영</span><span aria-hidden="true">·</span><span>주문 후 숯불 조리</span><span aria-hidden="true">·</span><span>인천 동암역</span></div></div>
<section id="odolbap" class="section wrap" aria-labelledby="odol-title"><div class="section-head"><div><p class="eyebrow red">01 / 닥코를 처음 만나는 맛</p><h2 id="odol-title">오돌밥이<br><span class="serif">뭔가요?</span></h2></div><div class="section-intro"><p>오돌밥은 일반적인 주먹밥과 다릅니다.<br><strong>양념한 오돌뼈와 밥을 함께 비벼<br>김에 싸 먹는 닥코의 대표 메뉴</strong>입니다.</p><p class="muted">이름은 낯설어도, 먹는 방법은 간단합니다.</p></div></div><div class="odol-layout"><div class="food-photo">${photo('odolbap','오돌뼈와 밥이 만나는 한 그릇')}</div><div class="steps"><article><span class="step-no">01</span><div><h3>함께 비벼요</h3><p>양념한 오돌뼈와 밥을 골고루 비벼주세요.</p></div></article><article><span class="step-no">02</span><div><h3>김 위에 올려요</h3><p>한 입 먹기 좋은 만큼 김 위에 올립니다.</p></div></article><article><span class="step-no">03</span><div><h3>싸서 한 입</h3><p>김에 싸서 오돌밥을 즐겨주세요.</p></div></article><div class="wrap-photo">${photo('wrap','김에 싸 먹는 오돌밥')}</div></div></div></section>
<section id="story" class="story-section"><div class="wrap story-layout"><div class="history-photo">${photo('history','시간이 쌓인 닥코의 기록')}</div><div class="story-copy"><p class="eyebrow">02 / 1996부터 이어온 이야기</p><h2>30년 동안<br>누군가의 청춘과<br>함께했습니다.</h2><p>1996년, 부모님이 시작한 닥코통닭발.<br>현재는 2대째 그 이야기를 이어가고 있습니다.</p><p>퇴근길 한잔, 오랜 친구와의 만남.<br>일상의 한 끼 속에서 닥코의 시간도 쌓여왔습니다.</p><div class="timeline"><div><strong>1996</strong><span>부모님이 시작한 닥코</span></div><span aria-hidden="true">→</span><div><strong>2026</strong><span>2대째, 이어가는 이야기</span></div></div></div></div></section>
<section id="charcoal" class="section wrap"><div class="section-head"><div><p class="eyebrow red">03 / 닥코의 본질</p><h2>주문 후 숯불에<br>직접 구워냅니다.</h2></div><p class="section-intro">불 앞에서 한 접시씩.<br>통닭발과 무뼈닭발, 취향에 맞게 즐겨주세요.</p></div><div class="charcoal-photo">${photo('charcoal','불과 연기, 그리고 숯불 닭발')}</div><div class="chicken-types"><article><span class="eyebrow">BONE-IN</span><h3>숯불 통닭발</h3><p>뼈 있는 닭발을 즐기는 분들을 위한 메뉴.</p></article><article><span class="eyebrow">BONELESS</span><h3>숯불 무뼈닭발</h3><p>뼈 없이 편하게 먹고 싶을 때 선택하는 메뉴.</p></article></div></section>
<section id="baseball" class="baseball-section"><div class="wrap baseball-layout"><div><p class="eyebrow red">04 / 음식에 남은 이야기</p><h2>야구선수들이<br>찾아 먹던 오돌밥.</h2><p>인천 경기가 있는 날, 오돌밥을 주문하거나<br>닥코를 방문했던 야구선수들의 이야기.</p><p class="muted">매장에 남아 있는 사진과 사인도<br>닥코가 이어온 기록의 일부입니다.</p></div><div class="baseball-photo">${photo('baseball','매장에 남아 있는 사진과 사인')}</div></div></section>
<section id="records" class="section wrap"><div class="section-head"><div><p class="eyebrow red">05 / 닥코의 기록</p><h2>30년 동안 쌓인 기록.</h2></div><p class="muted">확인된 이야기를 하나씩 기록합니다.</p></div><div class="record-list">${config.records.map(r=>`<article class="record"><div class="record-tag">${e(r.broadcaster)}<span>방송 소개</span></div><div><h3>「${e(r.program)}」 ${e(r.episode)}</h3><p>${e(r.title)}</p></div><time datetime="${e(r.date)}">${e(r.date.replaceAll('-','.'))}</time></article>`).join('')}</div></section>
<section id="menu" class="menu-section"><div class="wrap"><div class="section-head"><div><p class="eyebrow red">06 / 처음 오셨다면</p><h2>오늘은, 무엇을 먹을까요?</h2></div><p class="section-intro">오돌밥부터 숯불 닭발까지.<br>함께 온 사람들과 취향에 맞게 골라보세요.</p></div><div class="menu-grid">${config.menus.map((m,i)=>`<article class="menu-card"><div class="menu-card-top"><span>${e(m.category)}</span><span aria-hidden="true">0${i+1}</span></div><h3>${e(m.name)}</h3><p>${e(m.description)}</p>${m.price !== null ? `<span class="menu-price">${e(m.price)}원</span>`:''}</article>`).join('')}</div><div class="menu-bottom"><p>최신 메뉴 구성과 가격은 네이버 플레이스에서 확인해주세요.</p>${cta('NAVER_PLACE_URL','네이버에서 메뉴 보기','text-button')}</div></div></section>
<section class="section wrap occasions"><p class="eyebrow red">07 / 우리의 일상 속 닥코</p><h2>이런 날,<br>닥코를 찾아주세요.</h2><ul><li><span>01</span>퇴근 후 닭발에 한잔하고 싶은 날</li><li><span>02</span>오랜 친구들과 편하게 먹고 마시고 싶은 날</li><li><span>03</span>가족·동료들과 부담 없이 이야기하고 싶은 날</li><li><span>04</span>인천에서 조금 특별한 음식을 먹어보고 싶은 날</li><li><span>05</span>화려한 곳보다 세월이 쌓인 노포가 생각나는 날</li></ul></section>
<section id="visit" class="visit-section"><div class="wrap visit-layout"><div><p class="eyebrow">08 / 방문 안내</p><h2>오늘 저녁,<br>동암역에서 만나요.</h2><p class="visit-name">${e(config.name)}</p><p class="visit-address">${e(config.address)}<br><span>${e(config.station)}</span></p><dl class="visit-info"><div><dt>영업시간</dt><dd>${e(config.hours)}</dd></div><div><dt>라스트오더</dt><dd>${e(config.lastOrder)}</dd></div><div><dt>정기휴무</dt><dd>${e(config.closed)} 휴무</dd></div><div><dt>전화</dt><dd>${config.PHONE_NUMBER?`<a href="tel:${e(config.PHONE_NUMBER.replace(/[^+\d]/g,''))}">${e(config.PHONE_NUMBER)}</a>`:'전화번호 준비 중'}</dd></div></dl></div><div class="visit-card"><span class="location-symbol" aria-hidden="true">↗</span><p class="eyebrow">BEFORE YOUR VISIT</p><h3>사진도, 메뉴도, 리뷰도.<br>네이버에서 확인하세요.</h3><p>방문 전 최신 정보를 확인하고<br>닥코로 오는 길을 찾아보세요.</p>${cta('NAVER_PLACE_URL','네이버에서 메뉴·리뷰 보기','button cream')}${cta('NAVER_DIRECTIONS_URL','네이버 길찾기','button white-outline')}<p class="link-note">${!safeUrl(config.NAVER_PLACE_URL)||!safeUrl(config.NAVER_DIRECTIONS_URL)?'공식 링크는 확인 후 연결됩니다.':'네이버에서 최신 방문 정보를 확인해주세요.'}</p></div></div></section>
</main><footer class="footer"><div class="wrap"><div class="footer-top"><a class="logo" href="#"><span class="logo-seal">닥코</span><span class="logo-type">통닭발<small>SINCE 1996</small></span></a><p>1996년부터 이어온 인천 동암역의 닭발집.<br>두 세대가 이어가는 맛과 이야기를 기록합니다.</p><div class="social-links">${cta('INSTAGRAM_URL','Instagram','social',false)}${cta('YOUTUBE_URL','YouTube','social',false)}${cta('GOOGLE_MAP_URL','Google 지도','social',false)}</div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} 닥코통닭발</span><a href="#main">맨 위로 ↑</a></div></div></footer><aside class="mobile-cta" aria-label="빠른 방문 안내">${cta('NAVER_PLACE_URL','네이버에서 닥코 확인하기','button')}</aside></body></html>`;
}
export async function build() {
 await mkdir(out,{recursive:true});
 await cp(path.join(root,'public'),out,{recursive:true});
 await writeFile(path.join(out,'index.html'),render());
 await copyFile(path.join(root,'src/style.css'),path.join(out,'style.css'));
 await copyFile(path.join(root,'src/client.js'),path.join(out,'client.js'));
 const rawUrl = safeUrl(process.env.SITE_URL || site.SITE_URL);
 const url = rawUrl ? `${rawUrl.replace(/\/$/, '')}/` : null;
 await writeFile(path.join(out,'robots.txt'),`User-agent: *\nAllow: /\n${url?`Sitemap: ${new URL('sitemap.xml',url).href}\n`:''}`);
 await writeFile(path.join(out,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${url?`<url><loc>${esc(new URL('./',url).href)}</loc></url>`:''}</urlset>\n`);
 console.log(`Built static website in ${out}${url?'':' (SITE_URL 미설정: canonical과 sitemap 주소는 배포 주소 설정 후 생성됩니다.)'}`);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await build();
