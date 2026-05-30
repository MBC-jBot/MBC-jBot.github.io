const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const express = require('express');

const app = express();
app.use(express.static(path.join(__dirname, '..')));
const server = app.listen(3000, async () => {
  console.log('Server running on port 3000');
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/screenshotter/index.html', { waitUntil: 'networkidle0' });
  
  const xml = `
    <xml xmlns="https://developers.google.com/blockly/xml">
      <block type="event_whenarduinobegin" x="20" y="20">
        <next>
          <block type="motor_run2">
            <value name="SPEED_L"><shadow type="speed_number"><field name="NUM">50</field></shadow></value>
            <value name="SPEED_R"><shadow type="speed_number"><field name="NUM">50</field></shadow></value>
          </block>
        </next>
      </block>
    </xml>
  `;
  
  await page.evaluate((xmlStr) => {
    window.renderWorkspace(xmlStr);
  }, xml);
  
  await page.waitForTimeout(500);
  
  const svgContent = await page.evaluate(() => {
    return document.querySelector('.blocklySvg').outerHTML;
  });
  
  fs.writeFileSync('debug_svg.xml', svgContent);
  console.log('Saved debug_svg.xml');
  
  await browser.close();
  server.close();
});
