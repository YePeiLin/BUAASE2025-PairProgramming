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

export function greedy_snake_move(snake: Int32Array, food: Int32Array): i32 {
  const headX = snake[0];
  const headY = snake[1];
  const foodX = food[0];
  const foodY = food[1];

  // 优先x轴方向
  if (headX < foodX && canMove(snake, Directions.RIGHT)) {
    return Directions.RIGHT;
  }
  if (headX > foodX && canMove(snake, Directions.LEFT)) {
    return Directions.LEFT;
  }

  // 其次y轴方向
  if (headY < foodY && canMove(snake, Directions.UP)) {
    return Directions.UP;
  }
  if (headY > foodY && canMove(snake, Directions.DOWN)) {
    return Directions.DOWN;
  }

  // 安全方向兜底
  if (canMove(snake, Directions.UP)) return Directions.UP;
  if (canMove(snake, Directions.RIGHT)) return Directions.RIGHT;
  if (canMove(snake, Directions.DOWN)) return Directions.DOWN;
  if (canMove(snake, Directions.LEFT)) return Directions.LEFT;

  return Directions.UP; // 默认安全方向
}

//统一移动检查函数
function canMove(snake: Int32Array, direction: i32): bool {
  let x = snake[0], y = snake[1];

  switch (direction) {
    case Directions.UP:    y += 1; break;
    case Directions.DOWN:  y -= 1; break;
    case Directions.LEFT:  x -= 1; break;
    case Directions.RIGHT: x += 1; break;
  }

  // 边界检查
  if (x < 1 || x > 8 || y < 1 || y > 8) return false;

  // 碰撞检查（跳过蛇尾）
  for (let i = 2; i < 6; i += 2) {
    if (x == snake[i] && y == snake[i+1]) return false;
  }

  return true;
}