const puppeteer = require('puppeteer');
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
// Serve the entire docs folder so we can access JBC_Bot_V1 and screenshotter
app.use(express.static(path.join(__dirname, '..')));

const PORT = 3000;

// The 5 scenarios
const scenarios = [
  {
    name: 'motor_example',
    xml: `
      <xml xmlns="https://developers.google.com/blockly/xml">
        <block type="event_whenarduinobegin" x="20" y="20">
          <next>
            <block type="motor_run2">
              <value name="SPEED_L"><shadow type="speed_number"><field name="NUM">50</field></shadow></value>
              <value name="SPEED_R"><shadow type="speed_number"><field name="NUM">50</field></shadow></value>
              <next>
                <block type="control_wait">
                  <value name="DURATION"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                  <next>
                    <block type="motor_stop">
                      <field name="TYPE">MOTOR_L</field>
                      <field name="MODE">BRAKE</field>
                      <next>
                        <block type="motor_stop">
                          <field name="TYPE">MOTOR_R</field>
                          <field name="MODE">BRAKE</field>
                        </block>
                      </next>
                    </block>
                  </next>
                </block>
              </next>
            </block>
          </next>
        </block>
      </xml>
    `
  },
  {
    name: 'display_example',
    xml: `
      <xml xmlns="https://developers.google.com/blockly/xml">
        <block type="event_whenarduinobegin" x="20" y="20">
          <next>
            <block type="LED_SetColor">
              <value name="INDEX">
                <shadow type="light"><field name="NUM">1</field></shadow>
              </value>
              <value name="COLOR">
                <shadow type="text">
                  <field name="TEXT">#ff0000</field>
                </shadow>
              </value>
              <next>
                <block type="oled_print">
                  <value name="X"><shadow type="axis_x"><field name="NUM">0</field></shadow></value>
                  <value name="Y"><shadow type="axis_y"><field name="NUM">1</field></shadow></value>
                  <value name="TEXT">
                    <shadow type="text">
                      <field name="TEXT">Hello</field>
                    </shadow>
                  </value>
                </block>
              </next>
            </block>
          </next>
        </block>
      </xml>
    `
  },
  {
    name: 'sensor_example',
    xml: `
      <xml xmlns="https://developers.google.com/blockly/xml">
        <block type="event_whenarduinobegin" x="20" y="20">
          <next>
            <block type="control_forever">
              <statement name="SUBSTACK">
                <block type="control_if_else">
                  <value name="CONDITION">
                    <block type="operator_lt">
                      <value name="OPERAND1"><block type="VL53L0_readData"></block></value>
                      <value name="OPERAND2"><shadow type="math_number"><field name="NUM">100</field></shadow></value>
                    </block>
                  </value>
                  <statement name="SUBSTACK">
                    <block type="motor_stop">
                      <field name="TYPE">MOTOR_L</field>
                      <field name="MODE">BRAKE</field>
                      <next>
                        <block type="motor_stop">
                          <field name="TYPE">MOTOR_R</field>
                          <field name="MODE">BRAKE</field>
                        </block>
                      </next>
                    </block>
                  </statement>
                  <statement name="SUBSTACK2">
                    <block type="motor_run2">
                      <value name="SPEED_L"><shadow type="speed_number"><field name="NUM">50</field></shadow></value>
                      <value name="SPEED_R"><shadow type="speed_number"><field name="NUM">50</field></shadow></value>
                    </block>
                  </statement>
                </block>
              </statement>
            </block>
          </next>
        </block>
      </xml>
    `
  },
  {
    name: 'remote_example',
    xml: `
      <xml xmlns="https://developers.google.com/blockly/xml">
        <block type="event_whenarduinobegin" x="20" y="20">
          <next>
            <block type="control_forever">
              <statement name="SUBSTACK">
                <block type="control_if">
                  <value name="CONDITION">
                    <block type="ps2_isConnected"></block>
                  </value>
                  <statement name="SUBSTACK">
                    <block type="control_if_else">
                      <value name="CONDITION">
                        <block type="ps2_getButton">
                          <field name="BUTTON">PSB_CROSS</field>
                        </block>
                      </value>
                      <statement name="SUBSTACK">
                        <block type="servo_deg">
                          <field name="TYPE">SERVO_1</field>
                          <value name="DEG"><shadow type="deg_number"><field name="NUM">90</field></shadow></value>
                        </block>
                      </statement>
                      <statement name="SUBSTACK2">
                        <block type="servo_deg">
                          <field name="TYPE">SERVO_1</field>
                          <value name="DEG"><shadow type="deg_number"><field name="NUM">0</field></shadow></value>
                        </block>
                      </statement>
                    </block>
                  </statement>
                </block>
              </statement>
            </block>
          </next>
        </block>
      </xml>
    `
  },
  {
    name: 'advanced_example',
    xml: `
      <xml xmlns="https://developers.google.com/blockly/xml">
        <block type="event_whenarduinobegin" x="20" y="20">
          <next>
            <block type="motor_reset_deg">
              <field name="TYPE">ENC_ALL</field>
              <next>
                <block type="control_repeat_until">
                  <value name="CONDITION">
                    <block type="operator_gt">
                      <value name="OPERAND1">
                        <block type="motor_deg"><field name="TYPE">ENC_AVG</field></block>
                      </value>
                      <value name="OPERAND2">
                        <shadow type="math_number"><field name="NUM">600</field></shadow>
                      </value>
                    </block>
                  </value>
                  <statement name="SUBSTACK">
                    <block type="serial_print">
                      <value name="TEXT">
                        <block type="motor_deg"><field name="TYPE">ENC_AVG</field></block>
                      </value>
                      <next>
                        <block type="motor_run2">
                          <value name="SPEED_L"><shadow type="speed_number"><field name="NUM">50</field></shadow></value>
                          <value name="SPEED_R"><shadow type="speed_number"><field name="NUM">50</field></shadow></value>
                        </block>
                      </next>
                    </block>
                  </statement>
                  <next>
                    <block type="motor_stop">
                      <field name="TYPE">MOTOR_L</field>
                      <field name="MODE">BRAKE</field>
                      <next>
                        <block type="motor_stop">
                          <field name="TYPE">MOTOR_R</field>
                          <field name="MODE">BRAKE</field>
                        </block>
                      </next>
                    </block>
                  </next>
                </block>
              </next>
            </block>
          </next>
        </block>
      </xml>
    `
  },
  {
    name: 'first_program',
    xml: `
      <xml xmlns="https://developers.google.com/blockly/xml">
        <block type="event_whenarduinobegin" x="20" y="20">
          <next>
            <block type="motor_run2">
              <value name="SPEED_L"><shadow type="speed_number"><field name="NUM">50</field></shadow></value>
              <value name="SPEED_R"><shadow type="speed_number"><field name="NUM">50</field></shadow></value>
              <next>
                <block type="control_wait">
                  <value name="DURATION"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
                </block>
              </next>
            </block>
          </next>
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
    page.on('console', msg => console.log('[Browser Console]', msg.text()));
    page.on('pageerror', err => console.log('[Page Error]', err.toString()));
    page.on('requestfailed', request => console.log('[Request Failed]', request.url(), request.failure().errorText));
    await page.goto(`http://localhost:${PORT}/screenshotter/index.html`, { waitUntil: 'networkidle0' });

    for (const scenario of scenarios) {
      console.log("Rendering " + scenario.name + "...");
      
      await page.evaluate((xml) => {
        window.renderWorkspace(xml);
      }, scenario.xml);

      // Give SVG extra time to expand fields and render paths before taking bounding box
      await page.waitForTimeout(500);

      const bbox = await page.evaluate(() => {
        return window.getWorkspaceBBox();
      });

      if (bbox && !bbox.error) {
        
        await page.screenshot({
          path: path.join(outDir, scenario.name + ".png"),
          clip: {
            x: bbox.x,
            y: bbox.y,
            width: Math.max(10, bbox.width),
            height: Math.max(10, bbox.height)
          },
          omitBackground: true // Transparent background!
        });
        console.log("Saved " + scenario.name + ".png");
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
