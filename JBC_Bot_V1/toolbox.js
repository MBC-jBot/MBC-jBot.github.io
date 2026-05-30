/* eslint-disable func-style */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
function registerToolboxs () {
    return `
<category name="%{BKY_JBC_BOT_V1_BUTTON}" id="JBC_BOT_V1_BUTTON" colour="#bb4ef2" secondaryColour="#bb4ef2">
    <block type="button_press" id="button_press"></block>
</category>

<category name="%{BKY_JBC_BOT_V1_VOLTAGE}" id="JBC_BOT_V1_VOLTAGE" colour="#f31212" secondaryColour="#f02424">
    <block type="voltage_read" id="voltage_read"></block>
</category>

<category name="%{BKY_JBC_BOT_V1_MOTOR}" id="JBC_BOT_V1_MOTOR" colour="#4e92f2" secondaryColour="#4e92f2">
    <block type="motor_run" id="motor_run">
        <value name="SPEED">
            <shadow type="speed_number">
                <field name="NUM">100</field>
            </shadow>
        </value>
    </block>
    <block type="motor_run2" id="motor_run2">
        <value name="SPEED_L">
            <shadow type="speed_number">
                <field name="NUM">100</field>
            </shadow>
        </value>
        <value name="SPEED_R">
            <shadow type="speed_number">
                <field name="NUM">100</field>
            </shadow>
        </value>
    </block>
    <block type="motor_stop" id="motor_stop"></block>
    <block type="motor_deg" id="motor_deg"></block>
    <block type="motor_reset_deg" id="motor_reset_deg"></block>
    <sep gap="32"></sep>
    <block type="servo_deg" id="servo_seg">
        <value name="DEG">
            <shadow type="deg_number">
                <field name="NUM">90</field>
            </shadow>
        </value>
    </block>
</category>

<category name="%{BKY_JBC_BOT_V1_LED}" id="JBC_BOT_V1_LED" colour="#f5cb36" secondaryColour="#f5cb36">
    <block type="LED_SetColor" id="LED_SetColor">
        <value name="INDEX">
            <shadow type="light">
                <field name="NUM">1</field>
            </shadow>
        </value>
        <value name="COLOR">
            <shadow type="colour_picker"/>
        </value>
    </block>
    <block type="LED_clear" id="LED_clear"></block>
</category>

<category name="%{BKY_JBC_BOT_V1_LINE_SENSOR}" id="JBC_BOT_V1_LINE_SENSOR" colour="#774ef2" secondaryColour="#774ef2">
    <block type="line_single" id="line_single"></block>
</category>

<category name="%{BKY_JBC_BOT_V1_PS2}" id="JBC_BOT_V1_PS2" colour="#000000" secondaryColour="#000000">
    <block type="ps2_isConnected" id="ps2_isConnected"></block>
    <block type="ps2_getButton" id="ps2_getButton"></block>
    <block type="ps2_GetJoystick" id="ps2_GetJoystick"></block>
</category>

<category name="%{BKY_JBC_BOT_V1_VL53}" id="JBC_BOT_V1_VL53" colour="#f797cf" secondaryColour="#f797cf">
    <block type="VL53L0_readData" id="VL53L0_readData"></block>
</category>

<category name="%{BKY_JBC_BOT_V1_OLED}" id="JBC_BOT_V1_OLED" colour="#00a0a0" secondaryColour="#008080">
    <block type="oled_clear" id="oled_clear"></block>
    <block type="oled_print" id="oled_print">
        <value name="X">
            <shadow type="axis_x"><field name="NUM">0</field></shadow>
        </value>
        <value name="Y">
            <shadow type="axis_y"><field name="NUM">0</field></shadow>
        </value>
        <value name="TEXT">
            <shadow type="text"><field name="TEXT">Hello</field></shadow>
        </value>
    </block>
    <block type="oled_print_num" id="oled_print_num">
        <value name="X">
            <shadow type="axis_x"><field name="NUM">0</field></shadow>
        </value>
        <value name="Y">
            <shadow type="axis_y"><field name="NUM">1</field></shadow>
        </value>
        <value name="NUM">
            <shadow type="math_number"><field name="NUM">100</field></shadow>
        </value>
    </block>
</category>

<category name="%{BKY_JBC_BOT_V1_SERIAL}" id="JBC_BOT_V1_SERIAL" colour="#e52ff6" secondaryColour="#eb33db">
    <block type="Serial_Print" id="Serial_Print">
        <value name="TEXT">
            <shadow type="text">
                <field name="TEXT">Hello World!</field>
            </shadow>
        </value>
    </block>
</category>`;
}

exports = registerToolboxs;
