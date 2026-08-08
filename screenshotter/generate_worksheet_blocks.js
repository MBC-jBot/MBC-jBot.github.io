const puppeteer = require('puppeteer');
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.static(path.join(__dirname, '..')));

const PORT = 3002;

const scenarios = [
  {
    name: 'task1_forward',
    xml: `
      <xml xmlns="https://developers.google.com/blockly/xml">
        <block type="motor_run2">
          <value name="SPEED_L"><shadow type="speed_number"><field name="NUM">75</field></shadow></value>
          <value name="SPEED_R"><shadow type="speed_number"><field name="NUM">75</field></shadow></value>
          <next>
            <block type="control_wait_until">
              <value name="CONDITION">
                <block type="operator_lt">
                  <value name="OPERAND1"><block type="VL53L0_readData"></block></value>
                  <value name="OPERAND2"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
                </block>
              </value>
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
      </xml>
    `
  },
  {
    name: 'task2_radar',
    xml: `
      <xml xmlns="https://developers.google.com/blockly/xml">
        <block type="motor_reset_deg">
          <field name="TYPE">ENC_ALL</field>
          <next>
            <block type="data_setvariableto">
              <field name="VARIABLE">Heading_Angle</field>
              <value name="VALUE"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
              <next>
                <block type="data_setvariableto">
                  <field name="VARIABLE">Max_Distance</field>
                  <value name="VALUE"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
                  <next>
                    <block type="data_setvariableto">
                      <field name="VARIABLE">Target_Angle</field>
                      <value name="VALUE"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
                      <next>
                        <block type="motor_run2">
                          <value name="SPEED_L"><shadow type="speed_number"><field name="NUM">30</field></shadow></value>
                          <value name="SPEED_R"><shadow type="speed_number"><field name="NUM">-30</field></shadow></value>
                          <next>
                            <block type="control_repeat_until">
                              <value name="CONDITION">
                                <block type="operator_gt">
                                  <value name="OPERAND1"><block type="data_variable"><field name="VARIABLE">Heading_Angle</field></block></value>
                                  <value name="OPERAND2"><shadow type="math_number"><field name="NUM">360</field></shadow></value>
                                </block>
                              </value>
                              <statement name="SUBSTACK">
                                <block type="data_setvariableto">
                                  <field name="VARIABLE">Heading_Angle</field>
                                  <value name="VALUE">
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
                                  </value>
                                  <next>
                                    <block type="control_if">
                                      <value name="CONDITION">
                                        <block type="operator_gt">
                                          <value name="OPERAND1"><block type="VL53L0_readData"></block></value>
                                          <value name="OPERAND2"><block type="data_variable"><field name="VARIABLE">Max_Distance</field></block></value>
                                        </block>
                                      </value>
                                      <statement name="SUBSTACK">
                                        <block type="data_setvariableto">
                                          <field name="VARIABLE">Max_Distance</field>
                                          <value name="VALUE"><block type="VL53L0_readData"></block></value>
                                          <next>
                                            <block type="data_setvariableto">
                                              <field name="VARIABLE">Target_Angle</field>
                                              <value name="VALUE"><block type="data_variable"><field name="VARIABLE">Heading_Angle</field></block></value>
                                            </block>
                                          </next>
                                        </block>
                                      </statement>
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
    name: 'task3_shortcut',
    xml: `
      <xml xmlns="https://developers.google.com/blockly/xml">
        <block type="motor_reset_deg">
          <field name="TYPE">ENC_ALL</field>
          <next>
            <block type="data_setvariableto">
              <field name="VARIABLE">Heading_Angle</field>
              <value name="VALUE"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
              <next>
                <block type="control_if_else">
                  <value name="CONDITION">
                    <block type="operator_gt">
                      <value name="OPERAND1"><block type="data_variable"><field name="VARIABLE">Target_Angle</field></block></value>
                      <value name="OPERAND2"><shadow type="math_number"><field name="NUM">180</field></shadow></value>
                    </block>
                  </value>
                  <statement name="SUBSTACK">
                    <block type="data_setvariableto">
                      <field name="VARIABLE">Target_Angle</field>
                      <value name="VALUE">
                        <block type="operator_subtract">
                          <value name="NUM1"><shadow type="math_number"><field name="NUM">360</field></shadow></value>
                          <value name="NUM2"><block type="data_variable"><field name="VARIABLE">Target_Angle</field></block></value>
                        </block>
                      </value>
                      <next>
                        <block type="motor_run2">
                          <value name="SPEED_L"><shadow type="speed_number"><field name="NUM">-30</field></shadow></value>
                          <value name="SPEED_R"><shadow type="speed_number"><field name="NUM">30</field></shadow></value>
                        </block>
                      </next>
                    </block>
                  </statement>
                  <statement name="SUBSTACK2">
                    <block type="motor_run2">
                      <value name="SPEED_L"><shadow type="speed_number"><field name="NUM">30</field></shadow></value>
                      <value name="SPEED_R"><shadow type="speed_number"><field name="NUM">-30</field></shadow></value>
                    </block>
                  </statement>
                  <next>
                    <block type="control_repeat_until">
                      <value name="CONDITION">
                        <block type="operator_gt">
                          <value name="OPERAND1"><block type="data_variable"><field name="VARIABLE">Heading_Angle</field></block></value>
                          <value name="OPERAND2"><block type="data_variable"><field name="VARIABLE">Target_Angle</field></block></value>
                        </block>
                      </value>
                      <statement name="SUBSTACK">
                        <block type="data_setvariableto">
                          <field name="VARIABLE">Heading_Angle</field>
                          <value name="VALUE">
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
                          </value>
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
