const puppeteer = require('puppeteer');
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.static(path.join(__dirname, '..')));

const PORT = 3003;

const scenarios = [
  {
    name: 'hint_1_1',
    xml: `
      <xml xmlns="https://developers.google.com/blockly/xml">
        <block type="motor_run2">
          <value name="SPEED_L"><shadow type="speed_number"><field name="NUM">75</field></shadow></value>
          <value name="SPEED_R"><shadow type="speed_number"><field name="NUM">75</field></shadow></value>
        </block>
      </xml>
    `
  },
  {
    name: 'hint_1_2',
    xml: `
      <xml xmlns="https://developers.google.com/blockly/xml">
        <block type="VL53L0_readData" x="10" y="10"></block>
        <block type="control_wait_until" x="10" y="70"></block>
        <block type="operator_gt" x="150" y="10"></block>
        <block type="operator_lt" x="150" y="60"></block>
        <block type="operator_equals" x="150" y="110"></block>
      </xml>
    `
  },
  {
    name: 'hint_2_1',
    xml: `
      <xml xmlns="https://developers.google.com/blockly/xml">
        <block type="operator_multiply">
          <value name="NUM1">
            <block type="operator_mathop">
              <field name="OPERATOR">abs</field>
              <value name="NUM">
                <block type="operator_subtract">
                  <value name="NUM1"><block type="motor_deg"><field name="TYPE">ENC_L</field></block></value>
                  <value name="NUM2"><block type="motor_deg"><field name="TYPE">ENC_R</field></block></value>
                </block>
              </value>
            </block>
          </value>
          <value name="NUM2"><shadow type="math_number"><field name="NUM">0.21</field></shadow></value>
        </block>
      </xml>
    `
  },
  {
    name: 'hint_2_2',
    xml: `
      <xml xmlns="https://developers.google.com/blockly/xml">
        <block type="data_setvariableto">
          <field name="VARIABLE">Max_Distance</field>
        </block>
      </xml>
    `
  },
  {
    name: 'hint_3',
    xml: `
      <xml xmlns="https://developers.google.com/blockly/xml">
        <block type="operator_subtract">
          <value name="NUM1"><shadow type="math_number"><field name="NUM">360</field></shadow></value>
          <value name="NUM2"><block type="data_variable"><field name="VARIABLE">Target_Angle</field></block></value>
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
