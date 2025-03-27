// // 方向常量枚举
// const enum Directions {
//   UP = 0,
//   LEFT = 1,
//   DOWN = 2,
//   RIGHT = 3
// }
//
// // 辅助函数：计算曼哈顿距离
// function manhattanDistance(x1: i32, y1: i32, x2: i32, y2: i32): i32 {
//   return i32(Math.abs(x1 - x2)) + i32(Math.abs(y1 - y2));
// }
//
// // 安全移动检查函数（新增参数）
// function canMove(
//   n: i32,
//   snake: Int32Array,
//   direction: i32,
//   otherSnakes: Int32Array,
//   snakeCount: i32
// ): bool {
//   let x = snake[0];
//   let y = snake[1];
//
//   // 计算新位置
//   switch (direction) {
//     case Directions.UP:    y += 1; break;
//     case Directions.DOWN:  y -= 1; break;
//     case Directions.LEFT:  x -= 1; break;
//     case Directions.RIGHT: x += 1; break;
//   }
//
//   // 边界检查（使用动态尺寸）
//   if (x < 1 || x > n || y < 1 || y > n) return false;
//
//   // 自身碰撞检查（跳过蛇尾）
//   for (let i = 2; i < 6; i += 2) {
//     if (x == snake[i] && y == snake[i + 1]) return false;
//   }
//
//   // 其他蛇碰撞检查
//   for (let s = 0; s < snakeCount; s++) {
//     const start = s * 8;
//     // 检查每个蛇的每个身体部分
//     for (let i = start; i < start + 8; i += 2) {
//       if (x == otherSnakes[i] && y == otherSnakes[i + 1]) return false;
//     }
//   }
//
//   return true;
// }
//
// // 主决策函数
// export function greedy_snake_step(
//   n: i32,                 // 棋盘尺寸
//   snake: Int32Array,      // 自身蛇数据
//   snakeCount: i32,        // 其他蛇数量
//   otherSnakes: Int32Array,// 其他蛇数据
//   foodCount: i32,         // 食物数量
//   foods: Int32Array,      // 食物坐标
//   round: i32              // 剩余回合数
// ): i32 {
//   // 死亡检查
//   if (snake[0] == -1) return Directions.UP;
//
//   const headX = snake[0];
//   const headY = snake[1];
//
//   // 寻找最近食物
//   let targetX = -1;
//   let targetY = -1;
//   let minDist = Infinity;
//
//   for (let i = 0; i < foodCount; i++) {
//     const fx = foods[i * 2];
//     const fy = foods[i * 2 + 1];
//     const dist = manhattanDistance(headX, headY, fx, fy);
//
//     // 优先选择最近且可达的食物
//     if (dist < minDist) {
//       // 临时检查可达性
//       const xFirst = canMove(n, snake, (fx > headX) ? Directions.RIGHT : Directions.LEFT, otherSnakes, snakeCount)
//       const yFirst = canMove(n, snake, (fy > headY) ? Directions.UP : Directions.DOWN, otherSnakes, snakeCount);
//
//       if (xFirst || yFirst) {
//         minDist = dist;
//         targetX = fx;
//         targetY = fy;
//       }
//     }
//   }
//
//   // 食物优先策略
//   if (targetX != -1) {
//     // 横向优先策略
//     if (headX != targetX) {
//       const dir = (targetX > headX) ? Directions.RIGHT : Directions.LEFT;
//       if (canMove(n, snake, dir, otherSnakes, snakeCount)) return dir;
//     }
//
//     // 纵向次优策略
//     if (headY != targetY) {
//       const dir = (targetY > headY) ? Directions.UP : Directions.DOWN;
//       if (canMove(n, snake, dir, otherSnakes, snakeCount)) return dir;
//     }
//   }
//
//   // 安全兜底策略
//   const safeDirections = [
//     Directions.UP,
//     Directions.RIGHT,
//     Directions.DOWN,
//     Directions.LEFT
//   ];
//
//   // 优先选择远离边界的方向
//   for (let i = 0; i < safeDirections.length; i++) {
//     const dir = safeDirections[i];
//     if (canMove(n, snake, dir, otherSnakes, snakeCount)) {
//       // 计算新位置的安全性
//       const newX = headX + (dir == Directions.RIGHT ? 1 : dir == Directions.LEFT ? -1 : 0);
//       const newY = headY + (dir == Directions.UP ? 1 : dir == Directions.DOWN ? -1 : 0);
//
//       // 检查周边安全空间
//       let safeSpace = 0;
//       for (let j = 0; j < safeDirections.length; j++) {
//         const checkDir = safeDirections[j];
//         let checkX = newX + (checkDir == Directions.RIGHT ? 1 : checkDir == Directions.LEFT ? -1 : 0);
//         let checkY = newY + (checkDir == Directions.UP ? 1 : checkDir == Directions.DOWN ? -1 : 0);
//         if (checkX >= 1 && checkX <= n && checkY >= 1 && checkY <= n) safeSpace++;
//       }
//
//       // 优先选择安全空间多的方向
//       if (safeSpace >= 2) return dir;
//     }
//   }
//
//   // 最后兜底选择
//   for (let i = 0; i < safeDirections.length; i++) {
//     const dir = safeDirections[i];
//     if (canMove(n, snake, dir, otherSnakes, snakeCount)) return dir;
//   }
//
//   return Directions.UP; // 默认返回
// }

// 方向常量枚举
const enum Directions {
  UP = 0,    // 上 (+y)
  LEFT = 1,  // 左 (-x)
  DOWN = 2,  // 下 (-y)
  RIGHT = 3  // 右 (+x)
}

// 辅助函数：计算曼哈顿距离
function manhattanDistance(x1: i32, y1: i32, x2: i32, y2: i32): i32 {
  return i32(Math.abs(x1 - x2)) + i32(Math.abs(y1 - y2));
}

// 安全移动检查函数（新增参数），保持不变
function canMove(
  n: i32,
  snake: Int32Array,
  direction: i32,
  otherSnakes: Int32Array,
  snakeCount: i32
): bool {
  let x = snake[0];
  let y = snake[1];

  // 计算新位置
  switch (direction) {
    case Directions.UP:    y += 1; break;
    case Directions.DOWN:  y -= 1; break;
    case Directions.LEFT:  x -= 1; break;
    case Directions.RIGHT: x += 1; break;
  }

  // 边界检查（使用动态尺寸）
  if (x < 1 || x > n || y < 1 || y > n) return false;

  // 自身碰撞检查（跳过蛇尾）
  for (let i = 2; i < 6; i += 2) {
    if (x == snake[i] && y == snake[i + 1]) return false;
  }

  // 其他蛇碰撞检查
  for (let s = 0; s < snakeCount; s++) {
    const start = s * 8;
    // 检查每个蛇的每个身体部分
    for (let i = start; i < start + 8; i += 2) {
      if (x == otherSnakes[i] && y == otherSnakes[i + 1]) return false;
    }
  }

  return true;
}

// 主决策函数：优先级：存活 > 吃果子 > 进攻
export function greedy_snake_step(
  n: i32,                 // 棋盘尺寸
  snake: Int32Array,      // 自身蛇数据（4节，数组长度为8）
  snakeCount: i32,        // 其他蛇数量
  otherSnakes: Int32Array,// 其他蛇数据（长度为 snakeCount×8）
  foodCount: i32,         // 食物数量
  foods: Int32Array,      // 食物坐标（长度为 foodCount×2）
  round: i32              // 剩余回合数
): i32 {
  // 死亡检查：蛇头为 (-1,-1) 表示死亡
  if (snake[0] == -1) return Directions.UP;

  const headX = snake[0];
  const headY = snake[1];

  // --- 1. 构造威胁图 ---
  // 使用 Uint8Array 表示棋盘上每个格是否为敌人下一步移动后所占据的位置（危险区域）
  const totalCells = n * n;
  let threat = new Uint8Array(totalCells);

  // 遍历每个其他蛇
  for (let s = 0; s < snakeCount; s++) {
    let base = s * 8;
    // 取敌蛇的当前数据
    let enemyHeadX = otherSnakes[base];       // 蛇头横坐标
    let enemyHeadY = otherSnakes[base + 1];     // 蛇头纵坐标
    let enemyNeckX = otherSnakes[base + 2];     // 蛇脖子横坐标
    let enemyNeckY = otherSnakes[base + 3];     // 蛇脖子纵坐标

    // 计算敌蛇的当前移动方向（不能逆向）
    let rev_dx = enemyHeadX - enemyNeckX;
    let rev_dy = enemyHeadY - enemyNeckY;

    // 定义所有可能的方向（上下左右）
    const possibleDirs: i32[] = [Directions.UP, Directions.DOWN, Directions.LEFT, Directions.RIGHT];

    // 对每个方向，如果不是反向，则模拟移动后的整个蛇身
    for (let d = 0; d < possibleDirs.length; d++) {
      let move_dx: i32 = 0, move_dy: i32 = 0;
      switch (possibleDirs[d]) {
        case Directions.UP:    { move_dx = 0; move_dy = 1; break; }
        case Directions.DOWN:  { move_dx = 0; move_dy = -1; break; }
        case Directions.LEFT:  { move_dx = -1; move_dy = 0; break; }
        case Directions.RIGHT: { move_dx = 1; move_dy = 0; break; }
      }
      // 排除反向移动（蛇不能倒退）
      if (move_dx == rev_dx && move_dy == rev_dy) continue;

      // 计算敌蛇移动后的新蛇头位置
      let newHeadX = enemyHeadX + move_dx;
      let newHeadY = enemyHeadY + move_dy;

      // 如果新头超出边界，则跳过该方向
      if (newHeadX < 1 || newHeadX > n || newHeadY < 1 || newHeadY > n) continue;

      // 模拟敌蛇移动后的新蛇身：新头, 原头, 原脖子, 原第三节（原蛇尾舍弃）
      let newSnake: i32[] = [
        newHeadX, newHeadY,    // 新蛇头
        enemyHeadX, enemyHeadY, // 原蛇头变成第二节
        enemyNeckX, enemyNeckY, // 原脖子变成第三节
        otherSnakes[base + 4], otherSnakes[base + 5] // 原第三节变成第四节
      ];

      // 将新蛇身的每个坐标标记为危险区域
      for (let i = 0; i < newSnake.length; i += 2) {
        let cellX = newSnake[i];
        let cellY = newSnake[i + 1];
        let index = (cellX - 1) * n + (cellY - 1);
        threat[index] = 1;
      }
    }
  }


  // --- 2. 筛选目标果子 ---
  // 对于每个果子，计算自身与敌人的曼哈顿距离
  let targetX: i32 = -1;
  let targetY: i32 = -1;
  let minDist: i32 = 100; // 一个较大数
  for (let i = 0; i < foodCount; i++) {
    const fx = foods[i * 2];
    const fy = foods[i * 2 + 1];
    const distSelf = manhattanDistance(headX, headY, fx, fy);
    let enemyCloser = false;
    // 对每个敌蛇，比较其蛇头与该果子的距离
    for (let s = 0; s < snakeCount; s++) {
      const enemyHeadX = otherSnakes[s * 8];
      const enemyHeadY = otherSnakes[s * 8 + 1];
      const distEnemy = manhattanDistance(enemyHeadX, enemyHeadY, fx, fy);
      if (distEnemy < distSelf) { enemyCloser = true; break; }
    }
    // 如果没有敌人比自己更近，则候选此果子
    if (!enemyCloser && distSelf < minDist) {
      minDist = distSelf;
      targetX = fx;
      targetY = fy;
    }
  }

  // --- 3. 评分各个可行方向 ---
  // 定义候选方向集合
  const candidateDirs: i32[] = [Directions.UP, Directions.RIGHT, Directions.DOWN, Directions.LEFT];
  let bestDir: i32 = -1;
  let bestScore: i32 = -1000000;

  // 针对每个候选方向，若可移动则计算分数
  for (let d = 0; d < candidateDirs.length; d++) {
    const dir = candidateDirs[d];
    if (!canMove(n, snake, dir, otherSnakes, snakeCount)) continue;
    // 计算移动后新坐标
    let newX = headX;
    let newY = headY;
    switch (dir) {
      case Directions.UP:    newY++; break;
      case Directions.DOWN:  newY--; break;
      case Directions.LEFT:  newX--; break;
      case Directions.RIGHT: newX++; break;
    }
    // 初始化分数
    let score = 0;

    // 生存：如果新位置位于敌人可能到达的区域，扣分
    let idx = (newX - 1) * n + (newY - 1);
    if (threat[idx] == 1) score -= 1000; // 强烈惩罚

    // 吃果子：如果目标果子有效，距离越近分数越高（取负距离）
    if (targetX != -1) {
      score -= manhattanDistance(newX, newY, targetX, targetY) * 100;
    } else {
      // 如果没有合适果子，略微鼓励扩大安全区域
      score -= 500;
    }

    // 进攻：进攻策略（这里简单处理：如果新位置更靠近敌蛇，则略微奖励）
    for (let s = 0; s < snakeCount; s++) {
      const enemyHeadX = otherSnakes[s * 8];
      const enemyHeadY = otherSnakes[s * 8 + 1];
      // 如果新位置比当前蛇头更靠近某个敌蛇，则奖励
      if (manhattanDistance(newX, newY, enemyHeadX, enemyHeadY) < manhattanDistance(headX, headY, enemyHeadX, enemyHeadY)) {
        score += 200;
      }
    }

    // 选择分数最高的方向
    if (score > bestScore) {
      bestScore = score;
      bestDir = dir;
    }
  }

  // --- 4. 如果评分策略找不到合适方向，则回退到安全策略 ---
  if (bestDir != -1) {
    return bestDir;
  }
  // 安全回退：遍历候选方向，返回第一个可行方向
  for (let d = 0; d < candidateDirs.length; d++) {
    if (canMove(n, snake, candidateDirs[d], otherSnakes, snakeCount)) {
      return candidateDirs[d];
    }
  }

  return Directions.UP; // 最后兜底返回
}
