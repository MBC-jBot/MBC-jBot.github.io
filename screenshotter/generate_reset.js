const puppeteer = require('puppeteer');
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.static(path.join(__dirname, '..')));

const PORT = 3004;

const scenarios = [
  {
    name: 'hint_reset',
    xml: `
      <xml xmlns="https://developers.google.com/blockly/xml">
        <block type="motor_reset_deg">
          <field name="TYPE">ENC_ALL</field>
        </block>
      </xml>
    `
  }
];

const outDir = path.join(__dirname, '..', 'docs', 'public', 'images', 'blocks');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const server = app.listen(PORT, async () => {
  console.log("Server running on port " + PORT);
  
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    page.on('console', msg => console.log('[PAGE]', msg.text()));
    await page.goto('http://localhost:' + PORT + '/screenshotter/index.html', { waitUntil: 'networkidle0' });

    for (const scenario of scenarios) {
      console.log("Rendering " + scenario.name + "...");
      
      await page.evaluate((xml) => {
        window.renderWorkspace(xml);
      }, scenario.xml);

      await page.waitForTimeout(1000);

      const bbox = await page.evaluate(() => {
        return window.getWorkspaceBBox();
      });

      if (bbox && !bbox.error) {
        await page.setViewport({
          width: Math.ceil(bbox.width) + 100,
          height: Math.ceil(bbox.height) + 100
        });

        await page.waitForTimeout(500);

        await page.screenshot({
          path: path.join(outDir, scenario.name + ".webp"),
          type: "webp",
          quality: 90,
          clip: {
            x: bbox.x,
            y: bbox.y,
            width: Math.max(10, bbox.width),
            height: Math.max(10, bbox.height)
          },
          omitBackground: true
        });
        console.log("Saved " + scenario.name + ".webp");
      } else {
        console.error("Failed to render " + scenario.name + ":", bbox ? bbox.error : "Unknown error");
      }
    }

    await browser.close();
  } catch (e) {
    console.error("Puppeteer Error:", e);
  } finally {
    server.close();
    console.log("Done.");
  }
});
