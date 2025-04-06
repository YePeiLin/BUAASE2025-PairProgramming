// 方向常量枚举
const enum Directions {
  UP = 0,
  LEFT = 1,
  DOWN = 2,
  RIGHT = 3
}

// 辅助函数：计算曼哈顿距离（仅用于初始比较，不用于 TSP）
function manhattanDistance(x1: i32, y1: i32, x2: i32, y2: i32): i32 {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

// 修改后的 buildThreat：加入其他蛇模拟威胁，并加入自己除蛇尾外的身体
export function buildThreat(n: i32, snakeCount: i32, otherSnakes: Int32Array, mySnake: Int32Array): Uint8Array {
  const totalCells = n * n;
  let threat = new Uint8Array(totalCells);

  // 遍历每个其他蛇 - 使用 unchecked 访问数组
  for (let s = 0; s < snakeCount; s++) {
    let base = s << 3; // s * 8 的位运算替代
    let enemyHeadX = unchecked(otherSnakes[base]);
    let enemyHeadY = unchecked(otherSnakes[base + 1]);
    let enemyNeckX = unchecked(otherSnakes[base + 2]);
    let enemyNeckY = unchecked(otherSnakes[base + 3]);

    // 预计算其他蛇的固定部分
    const enemyThirdX = unchecked(otherSnakes[base + 4]);
    const enemyThirdY = unchecked(otherSnakes[base + 5]);

    let neckIndex = (enemyHeadX - 1) * n + (enemyHeadY - 1);
    let thirdIndex = (enemyNeckX - 1) * n + (enemyNeckY - 1);
    let fourthIndex = (enemyThirdX - 1) * n + (enemyThirdY - 1);

    unchecked(threat[neckIndex] = 1);
    unchecked(threat[thirdIndex] = 1);
    unchecked(threat[fourthIndex] = 1);

    // 检查所有可能方向的新头
    for (let d = 0; d < 4; d++) {
      let newHeadX = enemyHeadX;
      let newHeadY = enemyHeadY;

      // 使用 switch 替代 if-else 链
      switch (d) {
        case Directions.UP:    { newHeadY++; break; }
        case Directions.DOWN:  { newHeadY--; break; }
        case Directions.LEFT:  { newHeadX--; break; }
        case Directions.RIGHT: { newHeadX++; break; }
      }

      // 检查是否反向移动或超出边界
      if (newHeadX === enemyNeckX && newHeadY === enemyNeckY) continue;
      if (newHeadX < 1 || newHeadX > n || newHeadY < 1 || newHeadY > n) continue;

      // 计算威胁索引 - 使用 unchecked 访问
      let headIndex = (newHeadX - 1) * n + (newHeadY - 1);

      // 标记威胁 - 使用 unchecked 写入
      unchecked(threat[headIndex] = 2);
    }
  }

  // 处理自己的蛇 - 使用 unchecked 访问
  const myHeadX = unchecked(mySnake[0]);
  const myHeadY = unchecked(mySnake[1]);
  const myNeckX = unchecked(mySnake[2]);
  const myNeckY = unchecked(mySnake[3]);
  const myThirdX = unchecked(mySnake[4]);
  const myThirdY = unchecked(mySnake[5]);

  // 计算自己的索引 - 使用 unchecked 访问
  unchecked(threat[(myHeadX - 1) * n + (myHeadY - 1)] = 3);
  unchecked(threat[(myNeckX - 1) * n + (myNeckY - 1)] = 0);
  unchecked(threat[(myThirdX - 1) * n + (myThirdY - 1)] = 0);

  return threat;
}

// BFS 计算两点之间的最短距离，考虑 obstacles（非0视为障碍）
function bfsDistance(sx: i32, sy: i32, tx: i32, ty: i32, obstacles: Uint8Array, n: i32): i32 {
  const INF: i32 = 1000;
  const size = n * n;
  // 0 表示未访问，1 表示已访问
  let visited = new Uint8Array(size);
  let dist = new Int32Array(size);
  for (let i = 0; i < size; i++) {
    unchecked(dist[i] = INF);
  }

  // 将外部 1-index 坐标转换为内部 0-index 坐标
  let startIdx = (sx - 1) * n + (sy - 1);
  let targetX = tx - 1;
  let targetY = ty - 1;

  // 使用预分配的循环队列，避免 shift 带来的额外开销
  let queue = new Array<i32>(size);
  let head: i32 = 0, tail: i32 = 0;

  unchecked(visited[startIdx] = 1);
  unchecked(dist[startIdx] = 0);
  unchecked(queue[tail++] = startIdx);

  while (head < tail) {
    let idx = unchecked(queue[head++]);
    // 利用 0 索引计算当前的 x 和 y 坐标
    let cx = idx / n;         // 整除，当前行号（0-indexed）
    let cy = idx % n;         // 当前列号（0-indexed）

    // 如果当前格子就是目标，直接返回
    if (cx === targetX && cy === targetY) return unchecked(dist[idx]);

    // 右边 (cx, cy+1)
    if (cy + 1 < n) {
      let nIdx = idx + 1;
      if (unchecked(visited[nIdx]) === 0) {
        // 如果邻居是目标，无视障碍
        if (cx === targetX && cy + 1 === targetY) return unchecked(dist[idx]) + 1;
        if (unchecked(obstacles[nIdx]) === 0) {
          unchecked(visited[nIdx] = 1);
          unchecked(dist[nIdx] = unchecked(dist[idx]) + 1);
          unchecked(queue[tail++] = nIdx);
        }
      }
    }
    // 左边 (cx, cy-1)
    if (cy - 1 >= 0) {
      let nIdx = idx - 1;
      if (unchecked(visited[nIdx]) === 0) {
        if (cx === targetX && cy - 1 === targetY) return unchecked(dist[idx]) + 1;
        if (unchecked(obstacles[nIdx]) === 0) {
          unchecked(visited[nIdx] = 1);
          unchecked(dist[nIdx] = unchecked(dist[idx]) + 1);
          unchecked(queue[tail++] = nIdx);
        }
      }
    }
    // 下边 (cx+1, cy)
    if (cx + 1 < n) {
      let nIdx = idx + n;
      if (unchecked(visited[nIdx]) === 0) {
        if (cx + 1 === targetX && cy === targetY) return unchecked(dist[idx]) + 1;
        if (unchecked(obstacles[nIdx]) === 0) {
          unchecked(visited[nIdx] = 1);
          unchecked(dist[nIdx] = unchecked(dist[idx]) + 1);
          unchecked(queue[tail++] = nIdx);
        }
      }
    }
    // 上边 (cx-1, cy)
    if (cx - 1 >= 0) {
      let nIdx = idx - n;
      if (unchecked(visited[nIdx]) === 0) {
        if (cx - 1 === targetX && cy === targetY) return unchecked(dist[idx]) + 1;
        if (unchecked(obstacles[nIdx]) === 0) {
          unchecked(visited[nIdx] = 1);
          unchecked(dist[nIdx] = unchecked(dist[idx]) + 1);
          unchecked(queue[tail++] = nIdx);
        }
      }
    }
  }

  return INF;
}

// 内部状态更新函数
function updateFoodState(
  foods: Int32Array,
  otherSnakes: Int32Array,
  headX: i32,
  headY: i32
): void {
  const hx = unchecked(otherSnakes[0]);
  const hy = unchecked(otherSnakes[1]);

  // 检测被吃掉的果子
  for (let i = 0; i < 5; i++) {
    const code = unchecked(foodHistory[i]);
    if (code === 0) continue;

    const fx = code >> SHIFT_DIGIT;
    const fy = code & 0xF;

    if (headX === fx && headY === fy) {
      myScore += 1;
      unchecked(foodHistory[i] = 0); // 标记为已吃
    }

    if (hx === fx && hy === fy) {
      otherScore += 1;
      unchecked(foodHistory[i] = 0); // 标记为已吃
    }
  }

  // 标记新出现的食物
  for (let f = 0; f < 5; f++) {
    const fx = unchecked(foods[f * 2]);
    const fy = unchecked(foods[f * 2 + 1]);
    const code = (fx << SHIFT_DIGIT) | fy;

    let exists = false;
    for (let i = 0; i < 5; i++) {
      if (unchecked(foodHistory[i]) === code) {
        exists = true;
        break;
      }
    }

    if (!exists) {
      for (let i = 0; i < 5; i++) {
        if (unchecked(foodHistory[i]) === 0) {
          unchecked(foodHistory[i] = code);
          break;
        }
      }
    }
  }

}

function calSafeSpace(
  headX: i32,
  headY: i32,
  obstacles: Uint8Array,
  n: i32 // 棋盘大小
): i32 {
  let safeSpace = 0;
  for (let dir = 0; dir < 4; ++dir) {
    let newX = headX;
    let newY = headY;

    switch (dir) {
      case Directions.UP:    newY++; break;
      case Directions.DOWN:  newY--; break;
      case Directions.LEFT:  newX--; break;
      case Directions.RIGHT: newX++; break;
    }

    // 边界检查
    if (newX < 1 || newX > n || newY < 1 || newY > n) continue;

    // 障碍检查（0表示安全，非0表示障碍）
    const index = (newX - 1) * n + (newY - 1);
    if (unchecked(obstacles[index]) === 0) {
      safeSpace++;
    }
  }

  return safeSpace;
}

// 只计算 1v1 的得分
let SHIFT_DIGIT = 4;
let foodHistory = new StaticArray<u32>(5);
let myScore = 0;
let otherScore = 0;

export function greedy_snake_step(
  n: i32,
  snake: Int32Array,
  snakeCount: i32,
  otherSnakes: Int32Array,
  foodCount: i32,
  foods: Int32Array,
  round: i32
): i32 {
  // 预先判断：蛇头为 -1 表示异常，直接返回一个默认方向
  if (unchecked(snake[0]) === -1) return Directions.UP;

  // 首次调用时初始化（只针对 n === 5 且 round === 50）
  if (n === 5 && round === 50) {
    for (let i = 0; i < 5; i++) {
      unchecked(foodHistory[i] = 0);
    }
    myScore = 0;
    otherScore = 0;
  }

  // 缓存蛇头坐标
  const headX: i32 = unchecked(snake[0]);
  const headY: i32 = unchecked(snake[1]);

  // 更新食物状态（仅在 n===5 且有敌蛇时）
  if (n === 5 && snakeCount > 0) {
    updateFoodState(foods, otherSnakes, headX, headY);
  }

  // 记录下一步蛇尾坐标（已提前移动后留下的坐标）
  const nextTailX: i32 = unchecked(snake[4]);
  const nextTailY: i32 = unchecked(snake[5]);

  // 构造威胁图（包括敌蛇及自己除尾部外的身体）
  let threat = buildThreat(n, snakeCount, otherSnakes, snake);

  // 筛选目标果子：遍历所有果子，挑选敌人不更近的果子
  let targetX: i32 = -1;
  let targetY: i32 = -1;
  let minDist: i32 = 1000; // 初始距离设置一个较大值
  // 以中心为比较基准（注意：此处 center 为整数除法）
  const center: i32 = (n + 1) >> 1;
  const foodMap = new Uint8Array(n * n);
  for (let i = 0; i < foodCount; i++) {
    // 使用 unchecked 读取果子数据（每个果子由两个连续坐标组成）
    let fx: i32 = unchecked(foods[i * 2]);
    let fy: i32 = unchecked(foods[i * 2 + 1]);
    unchecked(foodMap[(fx - 1) * n + (fy - 1)] = 1);
    let distSelf: i32 = bfsDistance(headX, headY, fx, fy, threat, n);
    let enemyCloser: bool = false;
    // 遍历所有敌蛇，比较敌蛇头与果子的距离
    for (let s = 0; s < snakeCount; s++) {
      let enemyHeadX: i32 = unchecked(otherSnakes[s * 8]);
      let enemyHeadY: i32 = unchecked(otherSnakes[s * 8 + 1]);
      let distEnemy: i32 = i32(Math.abs(enemyHeadX - fx)) + i32(Math.abs(enemyHeadY - fy));
      if (distEnemy <= distSelf) {
        enemyCloser = true;
        // 针对 n===5 时同距情况，根据比分作微调
        if (n === 5 && distEnemy === distSelf && otherScore < myScore) {
          enemyCloser = false;
        }
        break;
      }
    }
    if (!enemyCloser) {
      if (distSelf < minDist) {
        minDist = distSelf;
        targetX = fx;
        targetY = fy;
      } else if (distSelf === minDist) {
        // 如果距离相等，则选择靠近中心的果子
        let d1: i32 = i32(Math.abs(fx - center)) + i32(Math.abs(fy - center));
        let d2: i32 = i32(Math.abs(targetX - center)) + i32(Math.abs(targetY - center));
        if (d1 < d2) {
          targetX = fx;
          targetY = fy;
        }
      }
    }
  }

  let bestDir: i32 = -1;
  let bestScore: i32 = -30000;

  // 蛇颈坐标（避免回头）
  const neckX: i32 = unchecked(snake[2]);
  const neckY: i32 = unchecked(snake[3]);

  for (let d = 0; d < 4; d++) {
    // 计算新蛇头位置（复制当前蛇头坐标）
    let newX: i32 = headX;
    let newY: i32 = headY;
    switch (d) {
      case Directions.UP:    newY++; break;
      case Directions.DOWN:  newY--; break;
      case Directions.LEFT:  newX--; break;
      case Directions.RIGHT: newX++; break;
    }
    // 边界检查
    if (newX < 1 || newX > n || newY < 1 || newY > n) continue;
    // 避免后退至蛇颈
    if (newX === neckX && newY === neckY) continue;

    let score: i32 = 0;
    let idx: i32 = (newX - 1) * n + (newY - 1);
    let collision: bool = false;
    let t: i32 = unchecked(threat[idx]);
    if (t === 1 || t === 3) {
      score -= 10000;
    } else if (t === 2) {
      score -= 4500;
      // 如果碰撞点位于角落，则额外降低分数
      if ((newX === 1 || newX === n) && (newY === 1 || newY === n)) score -= 2000;
      if (n === 5) {
        if (myScore > otherScore) {
          collision = true;
          score += 2000;
        } else if (otherScore >= myScore && unchecked(foodMap[(newX - 1) * n + (newY - 1)]) === 1) {
          score -= 500;
        }
      } else {
        score -= unchecked(foodMap[(newX - 1) * n + (newY - 1)]) * 500;
      }
    }
    // 吃果子：如果目标果子已确定，则距离越近分数越高（取负距离）
    if (targetX != -1) {
      score -= (i32(Math.abs(newX - targetX)) + i32(Math.abs(newY - targetY))) * 10;
    } else {
      score -= 500;
    }
    // 计算回尾巴和回蛇颈的距离，避免无法逃生情况
    const tailFlag: bool = bfsDistance(newX, newY, nextTailX, nextTailY, threat, n) >= 13;
    if ((n === 5 && !collision && tailFlag && bfsDistance(newX, newY, neckX, neckY, threat, n) >= 13) || (n === 8 && tailFlag)) {
      score -= 1000;
    }
    // 安全空间评分（可根据 calSafeSpace 的实现效果调整）
    score += calSafeSpace(newX, newY, threat, n);

    if (score > bestScore) {
      bestScore = score;
      bestDir = d;
    }
  }

  if (bestDir != -1) return bestDir;
  return Directions.UP;
}


