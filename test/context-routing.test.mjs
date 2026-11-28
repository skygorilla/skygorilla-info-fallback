import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const source = readFileSync(new URL('../main.js', import.meta.url), 'utf8');
const resolve = runInNewContext(source + '\n;detectContext;', {
  window: {location: {pathname: '/'}, addEventListener() {}},
  document: {readyState: 'loading', addEventListener() {}},
  setTimeout() {}
});
const actual = path => {const r = resolve(path); return [r.locale, r.key];};
const contexts = {maintenance:'maintenance', deploy:'deploy', outage:'outage',
  security:'security', 'coming-soon':'comingSoon', contact:'contact', status:'status', '404':'default'};
test('every existing 200-rewrite route has the intended context and locale', () => {
  const redirectText = readFileSync(new URL('../_redirects', import.meta.url), 'utf8');
  for (const line of redirectText.split('\n')) {
    const [route, target, code] = line.trim().split(/\s+/);
    if (code !== '200' || target !== '/index.html') continue;
    const parts = route.split('/').filter(Boolean);
    const locale = parts[0] === 'en' ? 'en' : 'hr';
    const name = ['hr','en'].includes(parts[0]) ? parts[1] : parts[0];
    assert.deepEqual(actual(route), [locale, name === undefined ? 'maintenance' : contexts[name]], route);
  }
});
test('translated navigation links retain the selected context across locale changes', () => {
  for (const [path,key] of Object.entries({odrzavanje:'maintenance',azuriranje:'deploy',
    incident:'outage',sigurnost:'security',uskoro:'comingSoon',kontakt:'contact'})) {
    const r = resolve('/hr/'+path);
    assert.deepEqual(actual(r.ctx.routes.en), ['en',key]);
    assert.deepEqual(actual(r.ctx.routes.hr), ['hr',key]);
  }
});
test('unknown and malformed paths cannot claim maintenance or an incident', () => {
  for (const path of ['/unknown','/hr/not-a-route','/outage/extra','/hr//outage','/constructor','/__proto__','/fr/outage'])
    assert.equal(resolve(path).key,'default',path);
  assert.deepEqual(actual('/en/unknown'), ['en','default']);
});
test('root, locale roots and trailing slash remain usable', () => {
  for (const path of ['/','/hr','/hr/']) assert.deepEqual(actual(path), ['hr','maintenance']);
  assert.deepEqual(actual('/en/'), ['en','maintenance']);
  assert.deepEqual(actual('/en/outage/'), ['en','outage']);
});
