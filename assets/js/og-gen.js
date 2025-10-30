// assets/js/og-gen.js
// Optional local generator: renders assets/og/template.html to assets/img/og-default.png
const fs = require('fs');
(async ()=>{
  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch({args:['--no-sandbox']});
  const page = await browser.newPage();
  const file = 'assets/og/template.html';
  await page.goto('file://' + process.cwd() + '/' + file);
  const out = 'assets/img/og-default.png';
  await page.screenshot({path: out, clip:{x:0,y:0,width:1200,height:630}});
  await browser.close();
  console.log('OG image written:', out);
})().catch(e=>{ console.error(e); process.exit(1); });