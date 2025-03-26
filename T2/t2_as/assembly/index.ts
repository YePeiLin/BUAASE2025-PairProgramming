// The entry file of your WebAssembly module.

export function add(a: i32, b: i32): i32 {
  return a + b;
}

// 方向常量枚举
const enum Directions {
  UP = 0,
  LEFT = 1,
  DOWN = 2,
  RIGHT = 3
}

export function greedy_snake_move_barriers(
  snake: Int32Array,
  food: Int32Array,
  barriers: Int32Array
): i32 {
  // 可达性预检
  if (!isReachable(snake, food, barriers)) return -1;

  const headX = snake[0];
  const headY = snake[1];
  const foodX = food[0];
  const foodY = food[1];

  // 复用优先级决策（增强canMove）
  if (headX < foodX && canMove(snake, Directions.RIGHT, barriers)) {
    return Directions.RIGHT;
  }
  if (headX > foodX && canMove(snake, Directions.LEFT, barriers)) {
    return Directions.LEFT;
  }
  if (headY < foodY && canMove(snake, Directions.UP, barriers)) {
    return Directions.UP;
  }
  if (headY > foodY && canMove(snake, Directions.DOWN, barriers)) {
    return Directions.DOWN;
  }

  // 安全方向后备
  const safeDirs = [Directions.UP, Directions.RIGHT, Directions.DOWN, Directions.LEFT];
  for (let i = 0; i < safeDirs.length; i++) {
    if (canMove(snake, safeDirs[i], barriers)) return safeDirs[i];
  }

  return -1; // 理论不可达
}

function canMove(
  snake: Int32Array,
  direction: i32,
  barriers: Int32Array = new Int32Array(0) // 默认空数组
): bool {
  let x = snake[0], y = snake[1];

  // 坐标计算（复用）
  switch (direction) {
    case Directions.UP: y++; break;
    case Directions.DOWN: y--; break;
    case Directions.LEFT: x--; break;
    case Directions.RIGHT: x++; break;
  }

  // 组合检查（可配置）
  return checkBoundary(x, y) &&
         checkBodyCollision(x, y, snake) &&
         checkBarriers(x, y, barriers);
}

// 模块化检查组件
function checkBoundary(x: i32, y: i32): bool {
  return x >= 1 && x <= 8 && y >= 1 && y <= 8;
}

function checkBodyCollision(x: i32, y: i32, snake: Int32Array): bool {
  for (let i = 2; i < 6; i += 2) {
    if (x == snake[i] && y == snake[i+1]) return false;
  }
  return true;
}

function checkBarriers(x: i32, y: i32, barriers: Int32Array): bool {
  for (let i = 0; i < 24; i += 2) {
    if (x == barriers[i] && y == barriers[i+1]) return false;
  }
  return true;
}

// BFS可达性检查（核心算法）
function isReachable(snake: Int32Array, food: Int32Array, barriers: Int32Array): bool {
  const headX = snake[0], headY = snake[1];
  if (headX == food[0] && headY == food[1]) return true; // 可以删吗, 因为食物一定在空格里

  const visited = new Uint8Array(64);
  const queue = new Int32Array(64);
  let front = 0, rear = 0;

  // 初始化队列
  queue[rear++] = (headX << 16) | headY;
  visited[(headX-1)*8 + (headY-1)] = 1;

  while (front < rear) {
    const current = queue[front++];
    const x = current >> 16, y = current & 0xFFFF;

    for (let dir = 0; dir < 4; dir++) {
      let nx = x, ny = y;
      switch(dir) {
        case Directions.UP: ny++; break;
        case Directions.DOWN: ny--; break;
        case Directions.LEFT: nx--; break;
        case Directions.RIGHT: nx++; break;
      }

      // 快速检查
      if (!checkBoundary(nx, ny)) continue;
      if (!checkBarriers(nx, ny, barriers)) continue;
      if (visited[(nx-1)*8 + (ny-1)]) continue;

      // 到达检测
      if (nx == food[0] && ny == food[1]) return true;

      // 入队
      queue[rear++] = (nx << 16) | ny;
      visited[(nx-1)*8 + (ny-1)] = 1;
    }
  }
  return false;
}