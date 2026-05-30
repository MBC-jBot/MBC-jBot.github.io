const puppeteer = require('puppeteer');
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.static(path.join(__dirname, '..')));

const PORT = 3001;

const xml = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="event_whenarduinobegin" x="20" y="20">
    <next>
      <block type="control_forever">
        <statement name="SUBSTACK">
          
          <block type="control_if_else">
            <value name="CONDITION"><block type="ps2_getButton"><field name="BUTTON">PSB_PAD_UP</field></block></value>
            <statement name="SUBSTACK">
              <block type="data_setvariableto">
                <field name="VARIABLE">speed</field>
                <value name="VALUE"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
              </block>
            </statement>
            <statement name="SUBSTACK2">
              <block type="control_if_else">
                <value name="CONDITION"><block type="ps2_getButton"><field name="BUTTON">PSB_PAD_DOWN</field></block></value>
                <statement name="SUBSTACK">
                  <block type="data_setvariableto">
                    <field name="VARIABLE">speed</field>
                    <value name="VALUE"><shadow type="math_number"><field name="NUM">-50</field></shadow></value>
                  </block>
                </statement>
                <statement name="SUBSTACK2">
                  <block type="data_setvariableto">
                    <field name="VARIABLE">speed</field>
                    <value name="VALUE"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
                  </block>
                </statement>
              </block>
            </statement>
            
            <next>
              <block type="control_if_else">
                <value name="CONDITION"><block type="ps2_getButton"><field name="BUTTON">PSB_PAD_LEFT</field></block></value>
                <statement name="SUBSTACK">
                  <block type="data_setvariableto">
                    <field name="VARIABLE">turn</field>
                    <value name="VALUE"><shadow type="math_number"><field name="NUM">-25</field></shadow></value>
                  </block>
                </statement>
                <statement name="SUBSTACK2">
                  <block type="control_if_else">
                    <value name="CONDITION"><block type="ps2_getButton"><field name="BUTTON">PSB_PAD_RIGHT</field></block></value>
                    <statement name="SUBSTACK">
                      <block type="data_setvariableto">
                        <field name="VARIABLE">turn</field>
                        <value name="VALUE"><shadow type="math_number"><field name="NUM">25</field></shadow></value>
                      </block>
                    </statement>
                    <statement name="SUBSTACK2">
                      <block type="data_setvariableto">
                        <field name="VARIABLE">turn</field>
                        <value name="VALUE"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
                      </block>
                    </statement>
                  </block>
                </statement>
                
                <next>
                  <block type="control_if_else">
                    <value name="CONDITION"><block type="ps2_getButton"><field name="BUTTON">PSB_L1</field></block></value>
                    <statement name="SUBSTACK">
                      <block type="data_setvariableto">
                        <field name="VARIABLE">speedL</field>
                        <value name="VALUE"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
                      </block>
                    </statement>
                    <statement name="SUBSTACK2">
                      <block type="control_if_else">
                        <value name="CONDITION"><block type="ps2_getButton"><field name="BUTTON">PSB_L2</field></block></value>
                        <statement name="SUBSTACK">
                          <block type="data_setvariableto">
                            <field name="VARIABLE">speedL</field>
                            <value name="VALUE"><shadow type="math_number"><field name="NUM">-50</field></shadow></value>
                          </block>
                        </statement>
                        <statement name="SUBSTACK2">
                          <block type="control_if">
                            <value name="CONDITION">
                              <block type="operator_not">
                                <value name="OPERAND">
                                  <block type="operator_equals">
                                    <value name="OPERAND1"><block type="ps2_GetJoystick"><field name="JOYSTICK">PSS_LY</field></block></value>
                                    <value name="OPERAND2"><shadow type="text"><field name="TEXT">0</field></shadow></value>
                                  </block>
                                </value>
                              </block>
                            </value>
                            <statement name="SUBSTACK">
                              <block type="data_setvariableto">
                                <field name="VARIABLE">speedL</field>
                                <value name="VALUE">
                                  <block type="operator_subtract">
                                    <value name="NUM1"><block type="ps2_GetJoystick"><field name="JOYSTICK">PSS_LY</field></block></value>
                                    <value name="NUM2"><shadow type="math_number"><field name="NUM">128</field></shadow></value>
                                  </block>
                                </value>
                              </block>
                            </statement>
                          </block>
                        </statement>
                      </block>
                    </statement>
                    
                    <next>
                      <block type="control_if_else">
                        <value name="CONDITION"><block type="ps2_getButton"><field name="BUTTON">PSB_R1</field></block></value>
                        <statement name="SUBSTACK">
                          <block type="data_setvariableto">
                            <field name="VARIABLE">speedR</field>
                            <value name="VALUE"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
                          </block>
                        </statement>
                        <statement name="SUBSTACK2">
                          <block type="control_if_else">
                            <value name="CONDITION"><block type="ps2_getButton"><field name="BUTTON">PSB_R2</field></block></value>
                            <statement name="SUBSTACK">
                              <block type="data_setvariableto">
                                <field name="VARIABLE">speedR</field>
                                <value name="VALUE"><shadow type="math_number"><field name="NUM">-50</field></shadow></value>
                              </block>
                            </statement>
                            <statement name="SUBSTACK2">
                              <block type="control_if">
                                <value name="CONDITION">
                                  <block type="operator_not">
                                    <value name="OPERAND">
                                      <block type="operator_equals">
                                        <value name="OPERAND1"><block type="ps2_GetJoystick"><field name="JOYSTICK">PSS_RY</field></block></value>
                                        <value name="OPERAND2"><shadow type="text"><field name="TEXT">0</field></shadow></value>
                                      </block>
                                    </value>
                                  </block>
                                </value>
                                <statement name="SUBSTACK">
                                  <block type="data_setvariableto">
                                    <field name="VARIABLE">speedR</field>
                                    <value name="VALUE">
                                      <block type="operator_subtract">
                                        <value name="NUM1"><block type="ps2_GetJoystick"><field name="JOYSTICK">PSS_RY</field></block></value>
                                        <value name="NUM2"><shadow type="math_number"><field name="NUM">128</field></shadow></value>
                                      </block>
                                    </value>
                                  </block>
                                </statement>
                              </block>
                            </statement>
                          </block>
                        </statement>
                        
                        <next>
                          <block type="motor_run">
                            <field name="TYPE">MOTOR_L</field>
                            <value name="SPEED">
                              <block type="arduino_data_dataConstrain">
                                <value name="DATA">
                                  <block type="operator_add">
                                    <value name="NUM1">
                                      <block type="operator_add">
                                        <value name="NUM1"><block type="data_variable"><field name="VARIABLE">speed</field></block></value>
                                        <value name="NUM2"><block type="data_variable"><field name="VARIABLE">turn</field></block></value>
                                      </block>
                                    </value>
                                    <value name="NUM2"><block type="data_variable"><field name="VARIABLE">speedL</field></block></value>
                                  </block>
                                </value>
                                <value name="ARG0"><shadow type="math_number"><field name="NUM">-100</field></shadow></value>
                                <value name="ARG1"><shadow type="math_number"><field name="NUM">100</field></shadow></value>
                              </block>
                            </value>
                            <next>
                              <block type="motor_run">
                                <field name="TYPE">MOTOR_R</field>
                                <value name="SPEED">
                                  <block type="arduino_data_dataConstrain">
                                    <value name="DATA">
                                      <block type="operator_add">
                                        <value name="NUM1">
                                          <block type="operator_subtract">
                                            <value name="NUM1"><block type="data_variable"><field name="VARIABLE">speed</field></block></value>
                                            <value name="NUM2"><block type="data_variable"><field name="VARIABLE">turn</field></block></value>
                                          </block>
                                        </value>
                                        <value name="NUM2"><block type="data_variable"><field name="VARIABLE">speedR</field></block></value>
                                      </block>
                                    </value>
                                    <value name="ARG0"><shadow type="math_number"><field name="NUM">-100</field></shadow></value>
                                    <value name="ARG1"><shadow type="math_number"><field name="NUM">100</field></shadow></value>
                                  </block>
                                </value>
                                <next>
                                  <block type="Serial_Print">
                                    <field name="ln"></field>
                                    <value name="TEXT"><block type="data_variable"><field name="VARIABLE">speedL</field></block></value>
                                    <next>
                                      <block type="Serial_Print">
                                        <field name="ln"></field>
                                        <value name="TEXT"><shadow type="text"><field name="TEXT">, </field></shadow></value>
                                        <next>
                                          <block type="Serial_Print">
                                            <field name="ln">ln</field>
                                            <value name="TEXT"><block type="data_variable"><field name="VARIABLE">speedR</field></block></value>
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
            </next>
          </block>

        </statement>
      </block>
    </next>
  </block>
</xml>
`;

const outDir = path.join(__dirname, '..', 'docs', 'public', 'images', 'blocks');

const server = app.listen(PORT, async () => {
  console.log("Server running on port " + PORT);
  
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    await page.goto('http://localhost:' + PORT + '/screenshotter/index.html', { waitUntil: 'networkidle0' });

    console.log("Rendering PS2_demo...");
    await page.evaluate((xml) => {
      window.renderWorkspace(xml);
    }, xml);

    await page.waitForTimeout(500);

    const bbox = await page.evaluate(() => {
      return window.getWorkspaceBBox();
    });

    if (bbox && !bbox.error) {
      await page.screenshot({
        path: path.join(outDir, "first_program_huge.png"),
        clip: {
          x: bbox.x,
          y: bbox.y,
          width: Math.max(10, bbox.width),
          height: Math.max(10, bbox.height)
        },
        omitBackground: true
      });
      console.log("Saved first_program_huge.png");
    } else {
      console.error("Failed to render:", bbox ? bbox.error : "Unknown error");
    }

    await browser.close();
  } catch (e) {
    console.error("Puppeteer Error:", e);
  } finally {
    server.close();
    console.log("Done.");
  }
});
