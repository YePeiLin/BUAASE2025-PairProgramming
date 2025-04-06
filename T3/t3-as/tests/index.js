// test_buildThreat_full.js
import assert from "assert";
import { buildThreat } from "../build/debug.js";

// 辅助函数：生成一个全 0 的 Uint8Array，长度为 n*n
function createZeroThreat(n) {
  return new Uint8Array(n * n);
}

// 将二维坐标 (x,y) 转为一维索引，棋盘坐标从 1 开始
function index(x, y, n) {
  return (x - 1) * n + (y - 1);
}

// 统一设定己方蛇（mySnake），本测试中己方蛇标记为 3
// 选择位于棋盘右上角，避免与敌蛇模拟区域冲突
const mySnake = new Int32Array([8, 8, 8, 7, 8, 6, 8, 5]);

// ---------------------------
// 测试1：单条敌蛇（位于棋盘中部）
// 敌蛇数据：头 (4,4)，脖子 (4,3)，第三节 (4,2)，蛇尾 (4,1)
// 允许方向：排除反向 DOWN，即允许 UP、LEFT、RIGHT
// UP 模拟：新蛇身为 [ (4,5), (4,4), (4,3), (4,2) ]
// LEFT 模拟：新蛇身为 [ (3,4), (4,4), (4,3), (4,2) ]
// RIGHT 模拟：新蛇身为 [ (5,4), (4,4), (4,3), (4,2) ]
(function testSingleEnemy() {
  const n = 8;
  const snakeCount = 1;
  const enemySnake = new Int32Array([4, 4, 4, 3, 4, 2, 4, 1]);
  const otherSnakes = enemySnake; // 单条敌蛇
  let threat = buildThreat(n, snakeCount, otherSnakes, mySnake);

  // 构造预期 threat：长度 64，全 0，再标记下列索引
  let expected = createZeroThreat(n);
  // 敌蛇模拟结果（来自敌蛇）：
  // UP 模拟： (4,5) → index 28，标记为2； (4,4) index 27 为1； (4,3) index 26 为1； (4,2) index 25 为1
  expected[28] = 2; expected[27] = 1; expected[26] = 1; expected[25] = 1;
  // LEFT 模拟： 新头 (3,4) → index = (3-1)*8+(4-1)=19，标记为2
  expected[19] = 2;
  // RIGHT 模拟： 新头 (5,4) → index = (5-1)*8+(4-1)=35，标记为2
  expected[35] = 2;
  // 加入己方蛇标记（mySnake）：mySnake = [8,8, 8,7, 8,6, 8,5]
  expected[index(8,8,n)] = 3; // (8,8) index = (8-1)*8+(8-1)= 7*8+7=63

  for (let i = 0; i < n * n; i++) {
    assert.strictEqual(threat[i], expected[i],
      `Test1 Failed at index ${i}: expected ${expected[i]}, got ${threat[i]}`);
  }
  console.log("Test1 (单条敌蛇) passed.");
})();

// ---------------------------
// 测试2：单条敌蛇边界情况
// 敌蛇数据：头 (1,1)，脖子 (1,2)，第三节 (1,3)，蛇尾 (1,4)
// 排除 UP（反向），仅允许 RIGHT 有效，新蛇身为 [ (2,1), (1,1), (1,2), (1,3) ]
(function testSingleEnemyBoundary() {
  const n = 8;
  const snakeCount = 1;
  const enemySnake = new Int32Array([1, 1, 1, 2, 1, 3, 1, 4]);
  const otherSnakes = enemySnake;
  let threat = buildThreat(n, snakeCount, otherSnakes, mySnake);

  let expected = createZeroThreat(n);
  // 仅有效方向为 RIGHT：新蛇头 (2,1) → index = (2-1)*8+(1-1)=8，标记为2
  expected[index(2,1,n)] = 2;
  // 模拟移动后的其余部分： (1,1) index 0 为1; (1,2) index 1 为1; (1,3) index 2 为1
  expected[index(1,1,n)] = 1;
  expected[index(1,2,n)] = 1;
  expected[index(1,3,n)] = 1;
  // 加入己方蛇标记
  expected[index(8,8,n)] = 3;

  for (let i = 0; i < n * n; i++) {
    assert.strictEqual(threat[i], expected[i],
      `Test2 Failed at index ${i}: expected ${expected[i]}, got ${threat[i]}`);
  }
  console.log("Test2 (单条敌蛇边界) passed.");
})();

// ---------------------------
// 测试3：两条敌蛇（分布在不同位置）
// 敌蛇 A：同 Test1 数据：[4,4,4,3,4,2,4,1]
// 敌蛇 B：头 (7,7)，脖子 (7,6)，第三节 (7,5)，蛇尾 (7,4)
// 对于 A：预期 UP 模拟：索引 25,26,27,28（28为2），LEFT：索引19（2），RIGHT：索引35（2）
// 对于 B：预期 UP 模拟：新蛇头 (7,8) → index55为2, (7,7)=54为1, (7,6)=53为1, (7,5)=52为1;
// LEFT：新蛇头 (6,7) → index46为2; RIGHT：新蛇头 (8,7) → index62为2
(function testTwoEnemies() {
  const n = 8;
  const snakeCount = 2;
  const enemyA = [4, 4, 4, 3, 4, 2, 4, 1];
  const enemyB = [7, 7, 7, 6, 7, 5, 7, 4];
  const otherSnakes = new Int32Array(enemyA.concat(enemyB));
  let threat = buildThreat(n, snakeCount, otherSnakes, mySnake);

  let expected = createZeroThreat(n);
  // 敌蛇 A：
  expected[25] = 1; expected[26] = 1; expected[27] = 1; expected[28] = 2;
  expected[19] = 2; expected[35] = 2;
  // 敌蛇 B：
  expected[55] = 2; expected[54] = 1; expected[53] = 1; expected[52] = 1;
  expected[46] = 2; expected[62] = 0;
  // 加入己方蛇标记
  expected[index(8,8,n)] = 3;

  for (let i = 0; i < n * n; i++) {
    assert.strictEqual(threat[i], expected[i],
      `Test3 Failed at index ${i}: expected ${expected[i]}, got ${threat[i]}`);
  }
  console.log("Test3 (两条敌蛇) passed.");
})();

// ---------------------------
// 测试4：三条敌蛇（不同区域）
// 敌蛇 A：同 Test1 数据：[4,4,4,3,4,2,4,1]
// 敌蛇 B：同 Test3 B：[7,7,7,6,7,5,7,4]
// 敌蛇 C：顶左角：头 (1,8)，脖子 (1,7)，第三节 (1,6)，蛇尾 (1,5)
// 对于 C，选择 RIGHT 模拟：新头 (2,8) → index15为2, (1,8)=index7为1, (1,7)=index6为1, (1,6)=index5为1
(function testThreeEnemies() {
  const n = 8;
  const snakeCount = 3;
  const enemyA = [4, 4, 4, 3, 4, 2, 4, 1];
  const enemyB = [7, 7, 7, 6, 7, 5, 7, 4];
  const enemyC = [1, 8, 1, 7, 1, 6, 1, 5];
  const otherSnakes = new Int32Array(enemyA.concat(enemyB, enemyC));
  let threat = buildThreat(n, snakeCount, otherSnakes, mySnake);

  let expected = createZeroThreat(n);
  // 敌蛇 A：
  expected[25] = 1; expected[26] = 1; expected[27] = 1; expected[28] = 2;
  expected[19] = 2; expected[35] = 2;
  // 敌蛇 B：
  expected[52] = 1; expected[53] = 1; expected[54] = 1; expected[55] = 2;
  expected[46] = 2; expected[62] = 0;
  // 敌蛇 C：
  expected[15] = 2; expected[7] = 1; expected[6] = 1; expected[5] = 1;
  // 加入己方蛇标记
  expected[index(8,8,n)] = 3;

  for (let i = 0; i < n * n; i++) {
    assert.strictEqual(threat[i], expected[i],
      `Test4 Failed at index ${i}: expected ${expected[i]}, got ${threat[i]}`);
  }
  console.log("Test4 (三条敌蛇) passed.");
})();

// ---------------------------
// 测试5：无敌蛇情况（snakeCount = 0）
// 此时 threat 应仅由己方蛇（mySnake）标记为 3
(function testNoEnemies() {
  const n = 8;
  const snakeCount = 0;
  const otherSnakes = new Int32Array(0);
  let threat = buildThreat(n, snakeCount, otherSnakes, mySnake);

  let expected = createZeroThreat(n);
  expected[index(8,8,n)] = 3; // (8,8) index63
  expected[index(8,7,n)] = 0; // index62
  expected[index(8,6,n)] = 0; // index61

  for (let i = 0; i < n * n; i++) {
    assert.strictEqual(threat[i], expected[i],
      `Test5 Failed at index ${i}: expected ${expected[i]}, got ${threat[i]}`);
  }
  console.log("Test5 (无敌蛇) passed.");
})();

console.log("所有 buildThreat 测试均已通过。");
