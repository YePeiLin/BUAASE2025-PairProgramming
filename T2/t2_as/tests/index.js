// import assert from "assert";
// import { add } from "../build/debug.js";
// assert.strictEqual(add(1, 2), 3);
// console.log("ok");

import assert from "assert";
import { greedy_snake_move_barriers } from "../build/debug.js";

const Directions = {
  UP: 0,    // 上 (+y)
  LEFT: 1,  // 左 (-x)
  DOWN: 2,  // 下 (-y)
  RIGHT: 3,  // 右 (+x)
  UNREACHABLE: -1 // 不可达
};

// 基础方向测试
assert.strictEqual(greedy_snake_move_barriers([4,4,4,5,4,6,4,7], [8,4]), Directions.RIGHT);
console.log("向右移动成功");

assert.strictEqual(greedy_snake_move_barriers([4,4,5,4,6,4,7,4], [4,8]), Directions.UP);
console.log("向上移动成功");

assert.strictEqual(greedy_snake_move_barriers([4,4,5,4,6,4,7,4], [4,1]), Directions.DOWN);
console.log("向下移动成功");

assert.strictEqual(greedy_snake_move_barriers([4,4,4,5,4,6,4,7], [1,4]), Directions.LEFT);
console.log("向左移动成功");

// 边界测试
assert.strictEqual(greedy_snake_move_barriers([8,4,7,4,6,4,5,4], [9,4]), Directions.UNREACHABLE);
console.log("右边界禁止向右通过，测试成功");

assert.strictEqual(greedy_snake_move_barriers([1,4,2,4,3,4,4,4], [0,4]), Directions.UNREACHABLE);
console.log("左边界禁止向左通过，测试成功");

assert.strictEqual(greedy_snake_move_barriers([4,8,4,7,4,6,4,5], [4,9]), Directions.UNREACHABLE);
console.log("上边界禁止向上通过，测试成功");

assert.strictEqual(greedy_snake_move_barriers([4,1,4,2,4,3,4,4], [4,0]), Directions.UNREACHABLE);
console.log( "下边界禁止向下通过，测试成功");

// 身体碰撞测试
// 测试场景：不在角落的U型蛇, 且蛇头右方是身体
assert.notStrictEqual(greedy_snake_move_barriers([3,3,4,3,4,2,3,2], [5,3]), Directions.RIGHT);
console.log("不在角落的U形蛇，不碰身体，测试成功");

assert.strictEqual(greedy_snake_move_barriers([3,3,4,3,4,2,3,2], [3,1]), Directions.DOWN);
console.log("不在角落的U形蛇，勇敢向蛇尾，测试成功");

// 角落测试
assert.strictEqual(greedy_snake_move_barriers([8,8,7,8,7,7,8,7], [6,9]), Directions.UNREACHABLE);
assert.strictEqual(greedy_snake_move_barriers([8,8,7,8,7,7,8,7], [6,8]), Directions.DOWN);
assert.strictEqual(greedy_snake_move_barriers([8,8,7,8,7,7,8,7], [6,7]), Directions.DOWN);
assert.strictEqual(greedy_snake_move_barriers([8,8,7,8,7,7,8,7], [6,6]), Directions.DOWN);
assert.strictEqual(greedy_snake_move_barriers([8,8,7,8,7,7,8,7], [7,6]), Directions.DOWN);
console.log("在角落的U形蛇，只能向蛇尾，测试成功");

console.log("greedy_snake_move_barriers 无障碍测试通过");
