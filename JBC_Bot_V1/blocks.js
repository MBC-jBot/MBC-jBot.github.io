function registerBlocks(Blockly) {
    //=======================button=====================
    const button_Color = '#bb4ef2';
    const button_SecondaryColour = '#bb4ef2';

    Blockly.Blocks.button_press = {
        init: function () {
            this.jsonInit({
                message0: Blockly.Msg.BUTTON_PRESS,
                args0: [],
                colour: button_Color,
                secondaryColour: button_SecondaryColour,
                extensions: ['output_boolean']
            });
        }
    };
    //=======================Line Sensor=====================
    const line_Color = '#774ef2';
    const line_SecondaryColour = '#774ef2';

    Blockly.Blocks.line_single = {
        init: function () {
            this.jsonInit({
                message0: Blockly.Msg.LINE_SINGLE,
                args0: [
                    {
                        type: 'field_dropdown',
                        name: 'INDEX',
                        options: [
                            [Blockly.Msg.LINE_LEFT, '0'],
                            [Blockly.Msg.LINE_RIGHT, '1']]
                    }
                ],
                colour: line_Color,
                secondaryColour: line_SecondaryColour,
                extensions: ['output_number']
            });
        }
    };

    //=======================motor=====================
    const motor_Color = '#4e92f2';
    const motor_SecondaryColour = '#4e92f2';

    Blockly.Blocks.motor_run = {
        init: function () {
            this.jsonInit({
                message0: Blockly.Msg.MOTOR_RUN,
                args0: [
                    {
                        type: 'field_dropdown',
                        name: 'TYPE',
                        options: [
                            [Blockly.Msg.MOTOR_RIGHT, 'MOTOR_R'],
                            [Blockly.Msg.MOTOR_LEFT, 'MOTOR_L']]
                    },
                    {
                        type: 'input_value',
                        name: 'SPEED'
                    }
                ],
                colour: motor_Color,
                secondaryColour: motor_SecondaryColour,
                extensions: ['shape_statement']
            });
        }
    };

    Blockly.Blocks.motor_run2 = {
        init: function () {
            this.jsonInit({
                message0: Blockly.Msg.MOTOR_RUN2,
                args0: [
                    {
                        type: 'input_value',
                        name: 'SPEED_L'
                    },
                    {
                        type: 'input_value',
                        name: 'SPEED_R'
                    }
                ],
                colour: motor_Color,
                secondaryColour: motor_SecondaryColour,
                extensions: ['shape_statement']
            });
        }
    };

    Blockly.Blocks.motor_stop = {
        init: function () {
            this.jsonInit({
                message0: Blockly.Msg.MOTOR_STOP,
                args0: [
                    {
                        type: 'field_dropdown',
                        name: 'TYPE',
                        options: [
                            [Blockly.Msg.MOTOR_RIGHT, 'MOTOR_R'],
                            [Blockly.Msg.MOTOR_LEFT, 'MOTOR_L']]
                    },
                    {
                        type: 'field_dropdown',
                        name: 'MODE',
                        options: [
                            [Blockly.Msg.MOTOR_SLIDE_WORD, '0'],
                            [Blockly.Msg.MOTOR_LOCK_WORD, 'BRAKE']]
                    },
                ],
                colour: motor_Color,
                secondaryColour: motor_SecondaryColour,
                extensions: ['shape_statement']
            });
        }
    };

    Blockly.Blocks.motor_deg = {
        init: function () {
            this.jsonInit({
                message0: Blockly.Msg.MOTOR_DEG,
                args0: [
                    {
                        type: 'field_dropdown',
                        name: 'TYPE',
                        options: [
                            [Blockly.Msg.MOTOR_RIGHT, 'ENC_R'],
                            [Blockly.Msg.MOTOR_LEFT, 'ENC_L'],
                            [Blockly.Msg.MOTOR_AVG, 'ENC_AVG']]
                    }
                ],
                colour: motor_Color,
                secondaryColour: motor_SecondaryColour,
                extensions: ['output_number']
            });
        }
    };

    Blockly.Blocks.motor_reset_deg = {
        init: function () {
            this.jsonInit({
                message0: Blockly.Msg.MOTOR_RESET_DEG,
                args0: [
                    {
                        type: 'field_dropdown',
                        name: 'TYPE',
                        options: [
                            [Blockly.Msg.MOTOR_RIGHT, 'ENC_R'],
                            [Blockly.Msg.MOTOR_LEFT, 'ENC_L'],
                            [Blockly.Msg.MOTOR_ALL, 'ENC_ALL']]
                    }
                ],
                colour: motor_Color,
                secondaryColour: motor_SecondaryColour,
                extensions: ['shape_statement']
            });
        }
    };

    Blockly.Blocks.speed_number = {
        init: function () {
            this.jsonInit({
                message0: '%1',
                args0: [
                    {
                        type: 'field_slider',
                        name: 'NUM',
                        value: '0',
                        precision: 1,
                        min: '-100',
                        max: '100'
                    }
                ],
                output: 'Number',
                outputShape: Blockly.OUTPUT_SHAPE_ROUND,
                colour: Blockly.Colours.textField,
                colourSecondary: Blockly.Colours.textField,
                colourTertiary: Blockly.Colours.textField
            });
        }
    };

    //=======================LED=====================
    const LED_Color = '#f5cb36';
    const LED_SecondaryColour = '#f5cb36';

    Blockly.Blocks.LED_SetColor = {
        init: function () {
            this.jsonInit({
                message0: Blockly.Msg.LED_SETCOLOR,
                args0: [
                    {
                        type: 'input_value',
                        name: 'INDEX'
                    },
                    {
                        type: 'input_value',
                        name: 'COLOR'
                    }
                ],
                colour: LED_Color,
                secondaryColour: LED_SecondaryColour,
                extensions: ['shape_statement']
            });
        }
    };

    Blockly.Blocks.LED_clear = {
        init: function () {
            this.jsonInit({
                message0: Blockly.Msg.LED_CLEAR,
                colour: LED_Color,
                secondaryColour: LED_SecondaryColour,
                extensions: ['shape_statement']
            });
        }
    };

    Blockly.Blocks.light = {
        init: function () {
            this.jsonInit({
                message0: '%1',
                args0: [
                    {
                        type: 'field_slider',
                        name: 'NUM',
                        value: '1',
                        precision: 1,
                        min: '1',
                        max: '4'
                    }
                ],
                output: 'Number',
                outputShape: Blockly.OUTPUT_SHAPE_ROUND,
                colour: Blockly.Colours.textField,
                colourSecondary: Blockly.Colours.textField,
                colourTertiary: Blockly.Colours.textField
            });
        }
    };

    //=======================SERVO=====================
    const servo_Color = '#e8a325';
    const servo_SecondaryColour = '#e8a325';

    Blockly.Blocks.servo_deg = {
        init: function () {
            this.jsonInit({
                message0: Blockly.Msg.SERVO_DEG,
                args0: [
                    {
                        type: 'field_dropdown',
                        name: 'TYPE',
                        options: [
                            [Blockly.Msg.SERVO_1, 'SERVO_1'],
                            [Blockly.Msg.SERVO_2, 'SERVO_2']]
                    },
                    {
                        type: 'input_value',
                        name: 'DEG'
                    }
                ],
                colour: servo_Color,
                secondaryColour: servo_SecondaryColour,
                extensions: ['shape_statement']
            });
        }
    };

    Blockly.Blocks.deg_number = {
        init: function () {
            this.jsonInit({
                message0: '%1',
                args0: [
                    {
                        type: 'field_slider',
                        name: 'NUM',
                        value: '90',
                        precision: 1,
                        min: '0',
                        max: '180'
                    }
                ],
                output: 'Number',
                outputShape: Blockly.OUTPUT_SHAPE_ROUND,
                colour: Blockly.Colours.textField,
                colourSecondary: Blockly.Colours.textField,
                colourTertiary: Blockly.Colours.textField
            });
        }
    };
    //=======================voltage=====================
    const voltage_Color = '#e8274b';
    const voltage_SecondaryColour = '#fa0f3b';

    Blockly.Blocks.voltage_read = {
        init: function () {
            this.jsonInit({
                message0: Blockly.Msg.VOLTAGE_READ,
                args0: [],
                colour: voltage_Color,
                secondaryColour: voltage_SecondaryColour,
                extensions: ['output_number']
            });
        }
    };
    //=========================PS2========================
    const ps2_Color = '#000000';
    const ps2_SecondaryColour = '#000000';

    Blockly.Blocks.ps2_isConnected = {
        init: function () {
            this.jsonInit({
                message0: Blockly.Msg.PS2_ISCONNECTED,
                args0: [],
                colour: ps2_Color,
                secondaryColour: ps2_SecondaryColour,
                extensions: ['output_boolean']
            });
        }
    };

    Blockly.Blocks.ps2_getButton = {
        init: function () {
            this.jsonInit({
                message0: Blockly.Msg.PS2_GETBUTTON,
                args0: [
                    {
                        type: 'field_dropdown',
                        name: 'BUTTON',
                        options: [
                            [Blockly.Msg.PS2_UP, 'PSB_PAD_UP'],
                            [Blockly.Msg.PS2_DOWN, 'PSB_PAD_DOWN'],
                            [Blockly.Msg.PS2_LEFT, 'PSB_PAD_LEFT'],
                            [Blockly.Msg.PS2_RIGHT, 'PSB_PAD_RIGHT'],
                            [Blockly.Msg.PS2_TRIANGLE, 'PSB_TRIANGLE'],
                            [Blockly.Msg.PS2_CIRCLE, 'PSB_CIRCLE'],
                            [Blockly.Msg.PS2_CROSS, 'PSB_CROSS'],
                            [Blockly.Msg.PS2_SQUARE, 'PSB_SQUARE'],
                            ['L1', 'PSB_L1'],
                            ['L2', 'PSB_L2'],
                            ['L3', 'PSB_L3'],
                            ['R1', 'PSB_R1'],
                            ['R2', 'PSB_R2'],
                            ['R3', 'PSB_R3'],
                            [Blockly.Msg.PS2_SELECT, 'PSB_SELECT'],
                            [Blockly.Msg.PS2_START, 'PSB_START']
                        ]
                    }
                ],
                colour: ps2_Color,
                secondaryColour: ps2_SecondaryColour,
                extensions: ['output_boolean']
            });
        }
    };

    Blockly.Blocks.ps2_GetJoystick = {
        init: function () {
            this.jsonInit({
                message0: Blockly.Msg.PS2_GETJOYSTICK,
                args0: [
                    {
                        type: 'field_dropdown',
                        name: 'JOYSTICK',
                        options: [
                            ['LX', 'PSS_LX'],
                            ['LY', 'PSS_LY'],
                            ['RX', 'PSS_RX'],
                            ['RY', 'PSS_RY']
                        ]
                    }
                ],
                colour: ps2_Color,
                secondaryColour: ps2_SecondaryColour,
                extensions: ['output_number']
            });
        }
    };


    //=======================VL53L0=====================
    const vl_color = '#f797cf';
    const vl_secondaryColour = '#f797cf';
    Blockly.Blocks.VL53L0_readData = {
        init: function () {
            this.jsonInit({
                message0: Blockly.Msg.VL53L0_READDATA,
                args0: [],
                colour: vl_color,
                secondaryColour: vl_secondaryColour,
                extensions: ['output_number']
            });
        }
    };
    //=======================OLED=====================
    const oled_color = '#00a0a0';
    const oled_secondaryColour = '#008080';

    Blockly.Blocks.oled_clear = {
        init: function () {
            this.jsonInit({
                message0: Blockly.Msg.OLED_CLEAR,
                colour: oled_color,
                secondaryColour: oled_secondaryColour,
                extensions: ['shape_statement']
            });
        }
    };

    Blockly.Blocks.oled_print = {
        init: function () {
            this.jsonInit({
                message0: Blockly.Msg.OLED_PRINT,
                args0: [
                    { type: 'input_value', name: 'X' },
                    { type: 'input_value', name: 'Y' },
                    { type: 'input_value', name: 'TEXT' }
                ],
                colour: oled_color,
                secondaryColour: oled_secondaryColour,
                extensions: ['shape_statement']
            });
        }
    };

    Blockly.Blocks.oled_print_num = {
        init: function () {
            this.jsonInit({
                message0: Blockly.Msg.OLED_PRINT_NUM,
                args0: [
                    { type: 'input_value', name: 'X' },
                    { type: 'input_value', name: 'Y' },
                    { type: 'input_value', name: 'NUM' }
                ],
                colour: oled_color,
                secondaryColour: oled_secondaryColour,
                extensions: ['shape_statement']
            });
        }
    };

    Blockly.Blocks.axis_x = {
        init: function () {
            this.jsonInit({
                message0: '%1',
                args0: [
                    {
                        type: 'field_slider',
                        name: 'NUM',
                        value: '0',
                        precision: 1,
                        min: '0',
                        max: '15'
                    }
                ],
                output: 'Number',
                outputShape: Blockly.OUTPUT_SHAPE_ROUND,
                colour: Blockly.Colours.textField,
                colourSecondary: Blockly.Colours.textField,
                colourTertiary: Blockly.Colours.textField
            });
        }
    };

    Blockly.Blocks.axis_y = {
        init: function () {
            this.jsonInit({
                message0: '%1',
                args0: [
                    {
                        type: 'field_slider',
                        name: 'NUM',
                        value: '0',
                        precision: 1,
                        min: '0',
                        max: '3'
                    }
                ],
                output: 'Number',
                outputShape: Blockly.OUTPUT_SHAPE_ROUND,
                colour: Blockly.Colours.textField,
                colourSecondary: Blockly.Colours.textField,
                colourTertiary: Blockly.Colours.textField
            });
        }
    };
    //=======================SERIAL=====================
    const serial_color = '#e52ff6';
    const serial_secondaryColour = '#eb33db';
    Blockly.Blocks.Serial_Print = {
        init: function () {
            this.jsonInit({
                message0: Blockly.Msg.SERIAL_PRINT,
                args0: [
                    {
                        type: 'field_dropdown',
                        name: 'ln',
                        options: [
                            [Blockly.Msg.SERIAL_LN, 'ln'],
                            [Blockly.Msg.SERIAL_NO_LN, ''],
                        ]
                    },
                    {
                        type: 'input_value',
                        name: 'TEXT'
                    }
                ],
                colour: serial_color,
                secondaryColour: serial_secondaryColour,
                extensions: ['shape_statement']
            });
        }
    };
    return Blockly;
}


exports = registerBlocks;