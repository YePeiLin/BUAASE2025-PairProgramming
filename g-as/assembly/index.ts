// 方向常量枚举
const enum Directions {
  UP = 0,
  LEFT = 1,
  DOWN = 2,
  RIGHT = 3
}

// 辅助函数：计算曼哈顿距离
function manhattanDistance(x1: i32, y1: i32, x2: i32, y2: i32): i32 {
  return i32(Math.abs(x1 - x2)) + i32(Math.abs(y1 - y2));
}

// 安全移动检查函数（新增参数）
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

// 主决策函数
export function greedy_snake_step(
  n: i32,                 // 棋盘尺寸
  snake: Int32Array,      // 自身蛇数据
  snakeCount: i32,        // 其他蛇数量
  otherSnakes: Int32Array,// 其他蛇数据
  foodCount: i32,         // 食物数量
  foods: Int32Array,      // 食物坐标
  round: i32              // 剩余回合数
): i32 {
  // 死亡检查
  if (snake[0] == -1) return Directions.UP;

  const headX = snake[0];
  const headY = snake[1];
  
  // 寻找最近食物
  let targetX = -1;
  let targetY = -1;
  let minDist = Infinity;
  
  for (let i = 0; i < foodCount; i++) {
    const fx = foods[i * 2];
    const fy = foods[i * 2 + 1];
    const dist = manhattanDistance(headX, headY, fx, fy);
    
    // 优先选择最近且可达的食物
    if (dist < minDist) {
      // 临时检查可达性
      const xFirst = canMove(n, snake, (fx > headX) ? Directions.RIGHT : Directions.LEFT, otherSnakes, snakeCount)
      const yFirst = canMove(n, snake, (fy > headY) ? Directions.UP : Directions.DOWN, otherSnakes, snakeCount);
      
      if (xFirst || yFirst) {
        minDist = dist;
        targetX = fx;
        targetY = fy;
      }
    }
  }

  // 食物优先策略
  if (targetX != -1) {
    // 横向优先策略
    if (headX != targetX) {
      const dir = (targetX > headX) ? Directions.RIGHT : Directions.LEFT;
      if (canMove(n, snake, dir, otherSnakes, snakeCount)) return dir;
    }
    
    // 纵向次优策略
    if (headY != targetY) {
      const dir = (targetY > headY) ? Directions.UP : Directions.DOWN;
      if (canMove(n, snake, dir, otherSnakes, snakeCount)) return dir;
    }
  }

  // 安全兜底策略
  const safeDirections = [
    Directions.UP,
    Directions.RIGHT,
    Directions.DOWN,
    Directions.LEFT
  ];
  
  // 优先选择远离边界的方向
  for (let i = 0; i < safeDirections.length; i++) {
    const dir = safeDirections[i];
    if (canMove(n, snake, dir, otherSnakes, snakeCount)) {
      // 计算新位置的安全性
      const newX = headX + (dir == Directions.RIGHT ? 1 : dir == Directions.LEFT ? -1 : 0);
      const newY = headY + (dir == Directions.UP ? 1 : dir == Directions.DOWN ? -1 : 0);
      
      // 检查周边安全空间
      let safeSpace = 0;
      for (let j = 0; j < safeDirections.length; j++) {
        const checkDir = safeDirections[j];
        let checkX = newX + (checkDir == Directions.RIGHT ? 1 : checkDir == Directions.LEFT ? -1 : 0);
        let checkY = newY + (checkDir == Directions.UP ? 1 : checkDir == Directions.DOWN ? -1 : 0);
        if (checkX >= 1 && checkX <= n && checkY >= 1 && checkY <= n) safeSpace++;
      }
      
      // 优先选择安全空间多的方向
      if (safeSpace >= 2) return dir;
    }
  }

  // 最后兜底选择
  for (let i = 0; i < safeDirections.length; i++) {
    const dir = safeDirections[i];
    if (canMove(n, snake, dir, otherSnakes, snakeCount)) return dir;
  }

  return Directions.UP; // 默认返回
}
