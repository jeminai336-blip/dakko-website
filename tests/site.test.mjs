import test from 'node:test';
import assert from 'node:assert/strict';
import { render, safeUrl } from '../scripts/build.mjs';
import { site } from '../src/site.config.js';
test('본문과 핵심 정보는 자바스크립트 없이 HTML에 포함된다', () => {
 const html = render();
 assert.equal((html.match(/<h1\b/g)||[]).length,1);
 for(const text of ['양념한 오돌뼈와 밥','1996년','2대째','동암광장로8번길 5','17:00 ~ 23:00','22:30','매주 일요일']) assert.ok(html.includes(text));
 for(const id of ['odolbap','story','baseball','records','menu','visit']) assert.ok(html.includes(`id="${id}"`));
 const schema = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
 assert.equal(schema['@type'],'Restaurant');
 assert.equal(schema.openingHoursSpecification[0].dayOfWeek.length,6);
 assert.ok(!('telephone' in schema));
 assert.ok(!html.includes('href="tel:'));
 assert.ok(!html.includes('같은 자리에서 30년'));
});
test('미확인 URL과 위험한 URL은 링크로 만들지 않는다',()=>{
 assert.equal(safeUrl('javascript:alert(1)'),null);
 assert.equal(safeUrl('http://example.com'),null);
 const html=render({...site,NAVER_PLACE_URL:'javascript:alert(1)'});
 assert.ok(!html.includes('javascript:'));
 assert.ok(html.includes('연결 준비 중'));
});
test('확인된 설정을 넣으면 안전한 새 창 링크와 전화가 생성된다',()=>{
 const html=render({...site,NAVER_PLACE_URL:'https://example.com/place',PHONE_NUMBER:'02-1234-5678'});
 assert.ok(html.includes('href="https://example.com/place"'));
 assert.ok(html.includes('rel="noopener noreferrer"'));
 assert.ok(html.includes('href="tel:0212345678"'));
});
test('공식 배포 URL이 있어야 canonical을 생성하며 설정 문자를 이스케이프한다',()=>{
 const html=render({...site,SITE_URL:'https://example.com/',name:'<script>bad</script>'});
 assert.ok(html.includes('rel="canonical" href="https://example.com/"'));
 assert.ok(!html.includes('<script>bad</script>'));
});
test('GitHub Pages 저장소 하위 경로에서 CSS, JS, 이미지 주소를 유지한다',()=>{
 const config={...site,SITE_URL:'https://example.com/dakko-website',history:[{src:'/images/history/test.jpg',year:'',caption:''}]};
 const html=render(config);
 for(const asset of ['style.css','design.css','client.js','favicon.svg','images/history/test.jpg']) assert.ok(html.includes(`/dakko-website/${asset}`));
 assert.ok(html.includes('rel="canonical" href="https://example.com/dakko-website/"'));
});
test('V3 섹션과 내비게이션이 고객 흐름 순서를 유지한다', () => {
 const html=render();
 const positions=['story','menu','odolbap','baseball','records','visit'].map(id=>html.indexOf(`<section id="${id}"`));
 assert.ok(positions.every((p,i)=>p>=0 && (!i||p>positions[i-1])));
 const nav=html.match(/<nav[^>]*>(.*?)<\/nav>/s)[1];
 assert.deepEqual([...nav.matchAll(/href="#(.*?)"/g)].map(m=>m[1]),['story','menu','odolbap','baseball','records','visit']);
 assert.ok(!html.includes('id="charcoal"'));
 assert.ok(!html.includes('주문 후 숯불에 직접 구워냅니다.'));
 assert.ok(!html.includes('occasions'));
});
test('HERO 핵심 메시지, 8개 사진 슬롯과 미확인 전화 비노출',()=>{
 const html=render();
 const hero=html.match(/<section class="hero wrap".*?<\/section>/s)[0];
 for(const copy of ['주문 후 숯불에 직접 구워내는 닭발','야구선수들이 찾아 먹던 오돌밥','SBS 「생활의 달인」 야구장 맛집 소개','닥코만의 전통과 스토리는 광고로 만들어지지 않았습니다.','손님들과 함께한 30년의 시간이 만들었습니다.']) assert.ok(hero.includes(copy));
 assert.equal((hero.match(/class="hero-slide"/g)||[]).length,8);
 assert.equal((hero.match(/class="slider-dot"/g)||[]).length,8);
 assert.equal((hero.match(/class="button(?: outline)?(?: unavailable)?"/g)||[]).length,2);
 assert.ok(!html.includes('<dt>전화</dt>'));
 const config={...site,photos:{...site.photos,hero1:{src:'/images/first.webp',alt:'1996년 기록 사진'},hero2:{src:'/images/second.webp',alt:'오돌밥 실물'}}};
 const withPhotos=render(config);
 assert.match(withPhotos,/<img[^>]*first.webp[^>]*fetchpriority="high"/);
 assert.match(withPhotos,/<img[^>]*second.webp[^>]*loading="lazy"/);
});
test('주소·영업시간 설정이 본문과 JSON-LD에 동시에 반영된다',()=>{
 const config={...site,structuredAddress:{...site.structuredAddress,streetAddress:'검증용 주소'},openingHours:{...site.openingHours,opens:'18:00',closes:'22:00'}};
 const html=render(config);
 const schema=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
 assert.equal(schema.address.streetAddress,'검증용 주소');
 assert.equal(schema.openingHoursSpecification[0].opens,'18:00');
 assert.ok(html.includes('18:00 ~ 22:00'));
 assert.ok(html.includes('인천 부평구 검증용 주소'));
});
test('확인된 야구 아카이브 항목을 추가하면 HTML에 안전하게 출력한다',()=>{
 const html=render({...site,baseballArchive:[{photo:'baseball',title:'확인된 사인 자료',description:'<내용> & 기록',date:'2026-03-30'}]});
 assert.ok(html.includes('확인된 사인 자료'));
 assert.ok(html.includes('&lt;내용&gt; &amp; 기록'));
 assert.ok(html.includes('class="archive-card"'));
});
test('실제 HERO 활성 src는 공백 없는 main1~main8 파일을 참조한다',()=>{
 assert.deepEqual(site.heroSlides.map(slide=>site.photos[slide.photo].src),[1,2,3,4,5,6,7,8].map(n=>`/images/hero/main${n}.png`));
 const html=render({...site,SITE_URL:'https://example.com/dakko-website/'});
 for(let n=1;n<=8;n++) assert.ok(html.includes(`src="/dakko-website/images/hero/main${n}.png"`));
 const hero = html.split('<section class="hero wrap"')[1].split('</section>')[0];
 assert.ok(!hero.includes('photo-placeholder'));
});

test('역사 필름은 설정 순서와 확인된 캡션을 유지한다', () => {
 const config = {...site, SITE_URL:'https://jeminai336-blip.github.io/dakko-website/', history:[{src:'/images/history/old.jpg',year:'1996',caption:'닥코의 시작'},{src:'/images/history/new.jpg',year:'',caption:''}]};
 const html=render(config);
 assert.ok(html.indexOf('/images/history/old.jpg') < html.indexOf('/images/history/new.jpg'));
 assert.ok(html.includes('src="/dakko-website/images/history/old.jpg"'));
 assert.ok(html.includes('<span>1996</span><span>닥코의 시작</span>'));
 assert.equal((html.match(/class="film-frame"/g)||[]).length,2);
 assert.equal((html.match(/<figcaption>/g)||[]).length,1);
 assert.ok(html.includes('30년 동안<br>누군가의 청춘과<br>함께했습니다.'));
});

test('역사 사진은 레이아웃에 남아 지연 로딩이 시작될 수 있다', () => {
 const html=render();
 const images=html.match(/<img class="history-image"[^>]*>/g)||[];
 assert.equal(images.length,site.history.length);
 assert.ok(images.every(tag=>!tag.includes(' hidden')));
 assert.ok(images[0].includes('loading="eager"'));
 assert.ok(images.slice(1).every(tag=>tag.includes('loading="lazy"')));
 assert.ok(html.includes('class="film-placeholder" hidden'));
});

test('오돌밥 영상은 Pages 경로와 모바일 반복 재생 설정을 사용한다', () => {
 const html=render({...site,SITE_URL:'https://jeminai336-blip.github.io/dakko-website/'});
 assert.ok(html.includes('src="/dakko-website/videos/odolbap.mp4" autoplay muted loop playsinline controls'));
 assert.ok(!render({...site,odolbapVideo:''}).includes('<video'));
});
