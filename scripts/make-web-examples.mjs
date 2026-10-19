// 產生教學用的網頁版範例檔（.jbot，jBot 積木編程網站「開啟檔案」可以直接打開）
// 每課的程式邏輯跟原本 OpenBlock 範例圖一樣，只是改用網頁版的積木。
// 用法：node scripts/make-web-examples.mjs   → docs/public/example/web/*.jbot
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'docs/public/example/web');

const n = (v) => ({ shadow: { type: 'math_number', fields: { NUM: v } } });
const text = (t) => ({ shadow: { type: 'text', fields: { TEXT: t } } });
const blk = (b) => ({ block: b });
// 把敘述積木串起來
function seq(...bs) {
  const list = bs.flat().filter(Boolean).map((b) => ({ ...b }));
  for (let i = list.length - 2; i >= 0; i--) list[i].next = { block: list[i + 1] };
  return list[0];
}
// 「開機時執行一次」「主迴圈 (一直重複)」兩顆開頭積木（跟安裝版一樣；網站載入時會依實際高度把主迴圈排在下面）
function program(setup, loop, variables = []) {
  const ws = { blocks: { languageVersion: 0, blocks: [
    { type: 'jbot_setup', x: 40, y: 40, deletable: false, ...(setup.length ? { next: blk(seq(...setup)) } : {}) },
    { type: 'jbot_loop', x: 40, y: 80 + 56 * setup.length, deletable: false, ...(loop.length ? { next: blk(seq(...loop)) } : {}) },
  ] } };
  if (variables.length) ws.variables = variables.map((name) => ({ name, id: `var_${name}` }));
  return ws;
}

const init = { type: 'jbot_init' };
const wait = (sec) => ({ type: 'time_delay_seconds', inputs: { SEC: n(sec) } });
const motors = (l, r) => ({ type: 'jbot_motor_run2', inputs: { speedL: n(l), speedR: n(r) } });
const motor = (side, speed) => ({ type: 'jbot_motor_run', fields: { type: side }, inputs: { speed } });
const stop = (side, mode) => ({ type: 'jbot_motor_stop', fields: { type: side, mode } });
const stopBoth = (mode) => [stop('MOTOR_L', mode), stop('MOTOR_R', mode)];
const led = (i, r, g, b) => ({ type: 'jbot_led_set', fields: { index: String(i) }, inputs: { r: n(r), g: n(g), b: n(b) } });
const compare = (a, op, b) => ({ block: { type: 'logic_compare', fields: { OP: op }, inputs: { A: a, B: b } } });
const ifElse = (cond, then, otherwise) => ({
  type: 'controls_if', extraState: otherwise ? { hasElse: true } : undefined,
  inputs: { IF0: cond, DO0: blk(seq(...then)), ...(otherwise ? { ELSE: blk(seq(...otherwise)) } : {}) },
});
const ps2Button = (b) => ({ block: { type: 'jbot_ps2_button', fields: { button: b } } });
const stick = (s) => ({ block: { type: 'jbot_ps2_stick', fields: { stick: s } } });
const getVar = (name) => ({ block: { type: 'variables_get', fields: { VAR: { id: `var_${name}` } } } });
const setVar = (name, value) => ({ type: 'variables_set', fields: { VAR: { id: `var_${name}` } }, inputs: { VALUE: value } });
const arith = (op, a, b) => ({ block: { type: 'math_arithmetic', fields: { OP: op }, inputs: { A: a, B: b } } });
const print = (value, newline = true) => ({ type: 'serial_print', fields: { NEWLINE: newline ? 'LN' : 'NO' }, inputs: { VALUE: value } });
const encoderAvg = { block: { type: 'jbot_motor_deg', fields: { type: 'ENC_AVG' } } };

// 按下「上／下」設定值，都沒按就是 0（巢狀如果…否則，跟 OpenBlock 範例一樣）
const choose3 = (btnA, btnB, name, a, b) => ifElse(ps2Button(btnA), [setVar(name, n(a))], [ifElse(ps2Button(btnB), [setVar(name, n(b))], [setVar(name, n(0))])]);
// L1／L2（R1／R2）：按鍵全速，否則搖桿不在 0 時用「搖桿值 − 128」
const shoulder = (btnA, btnB, s, name) => ifElse(ps2Button(btnA), [setVar(name, n(50))], [ifElse(ps2Button(btnB), [setVar(name, n(-50))],
  [ifElse({ block: { type: 'logic_negate', inputs: { BOOL: compare(stick(s), 'EQ', n(0)) } } }, [setVar(name, arith('MINUS', stick(s), n(128)))])])]);
const clamp = (v) => ({ block: { type: 'math_constrain', inputs: { VALUE: v, LOW: n(-100), HIGH: n(100) } } });

const examples = {
  // 開始使用：第一支程式（前進 2 秒後滑行停下）
  'first-program': program([init, motors(50, 50), wait(2), ...stopBoth('0')], []),
  // 第 1 課：走走停停碰碰車
  'lesson1-motor': program([init, motors(50, 50), wait(1), ...stopBoth('BRAKE')], []),
  // 第 2 課：專屬電子名牌（紅燈＋OLED 顯示 Hello）
  'lesson2-display': program([init, led(1, 255, 0, 0), { type: 'jbot_oled_clear' },
    { type: 'jbot_oled_print', inputs: { X: n(0), Y: n(1), TEXT: text('Hello') } }], []),
  // 第 3 課：智慧防撞車
  'lesson3-sensor': program([init], [ifElse(compare({ block: { type: 'jbot_laser_distance' } }, 'LT', n(100)), stopBoth('BRAKE'), [motors(50, 50)])]),
  // 第 4 課：無敵遙控機械臂
  'lesson4-remote': program([init], [ifElse({ block: { type: 'jbot_ps2_is_connected' } },
    [ifElse(ps2Button('PSB_CROSS'), [{ type: 'jbot_servo_deg', fields: { type: 'SERVO_1' }, inputs: { deg: n(90) } }],
      [{ type: 'jbot_servo_deg', fields: { type: 'SERVO_1' }, inputs: { deg: n(0) } }])])]),
  // 第 5 課：精準走地磚（編碼器平均 > 600 才停）
  'lesson5-encoder': program([init, { type: 'jbot_motor_reset_deg', fields: { type: 'ENC_ALL' } },
    { type: 'controls_whileUntil', fields: { MODE: 'UNTIL' }, inputs: { BOOL: compare(encoderAvg, 'GT', n(600)), DO: blk(seq(print(encoderAvg), motors(50, 50))) } },
    ...stopBoth('BRAKE')], []),
  // 第 6 課：PS2 遙控車與全方位控制
  'lesson6-ps2-demo': program([init], [
    choose3('PSB_PAD_UP', 'PSB_PAD_DOWN', 'speed', 50, -50),
    choose3('PSB_PAD_LEFT', 'PSB_PAD_RIGHT', 'turn', -25, 25),
    shoulder('PSB_L1', 'PSB_L2', 'PSS_LY', 'speedL'),
    shoulder('PSB_R1', 'PSB_R2', 'PSS_RY', 'speedR'),
    motor('MOTOR_L', clamp(arith('ADD', arith('ADD', getVar('speed'), getVar('turn')), getVar('speedL')))),
    motor('MOTOR_R', clamp(arith('ADD', arith('MINUS', getVar('speed'), getVar('turn')), getVar('speedR')))),
    print(getVar('speedL'), false), print(text(','), false), print(getVar('speedR')),
  ], ['speed', 'turn', 'speedL', 'speedR']),
};

fs.mkdirSync(OUT, { recursive: true });
for (const [name, workspace] of Object.entries(examples)) {
  const file = { format: 'jbot-blocks', version: 1, savedAt: '2026-10-18T00:00:00.000Z', workspace };
  fs.writeFileSync(path.join(OUT, `${name}.jbot`), JSON.stringify(file, null, 1));
}
console.log(`${Object.keys(examples).length} 個範例 → ${path.relative(ROOT, OUT)}`);
