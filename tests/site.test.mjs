import test from 'node:test';
import assert from 'node:assert/strict';
import { render, safeUrl } from '../scripts/build.mjs';
import { site } from '../src/site.config.js';
test('본문과 핵심 정보는 자바스크립트 없이 HTML에 포함된다', () => {
 const html = render();
 assert.equal((html.match(/<h1\b/g)||[]).length,1);
 for(const text of ['양념한 오돌뼈와 밥','1996년','2대째','동암광장로8번길 5','17:00 ~ 23:00','22:30','매주 일요일']) assert.ok(html.includes(text));
 for(const id of ['odolbap','story','charcoal','baseball','records','menu','visit']) assert.ok(html.includes(`id="${id}"`));
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
 const config={...site,SITE_URL:'https://example.com/dakko-website',photos:{...site.photos,hero:{src:'/images/hero.webp',alt:'실제 사진'}}};
 const html=render(config);
 for(const asset of ['style.css','client.js','favicon.svg','images/hero.webp']) assert.ok(html.includes(`/dakko-website/${asset}`));
 assert.ok(html.includes('rel="canonical" href="https://example.com/dakko-website/"'));
});
