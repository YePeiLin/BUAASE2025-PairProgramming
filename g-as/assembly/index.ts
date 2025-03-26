// The entry file of your WebAssembly module.

export function add(a: i32, b: i32): i32 {
  return a + b;
}

////////////////////
////////////////////
////////////////////

export function greedy_snake_move(snake: Int32Array, food: Int32Array): i32 {
  const headX = snake[0];
  const headY = snake[1];
  const foodX = food[0];
  const foodY = food[1];

  // 优先考虑x轴方向移动
  if (headX < foodX && canMoveRight(snake)) {
    return 1; // 右
  } else if (headX > foodX && canMoveLeft(snake)) {
    return 3; // 左
  }

  // 其次考虑y轴方向移动
  if (headY < foodY && canMoveUp(snake)) {
    return 0; // 上
  } else if (headY > foodY && canMoveDown(snake)) {
    return 2; // 下
  }

  // 如果直接移动不可行，尝试其他安全方向
  if (canMoveUp(snake)) return 0;
  if (canMoveRight(snake)) return 1;
  if (canMoveDown(snake)) return 2;
  if (canMoveLeft(snake)) return 3;

  // 实在无路可走（理论上不应该发生）
  return 0; // 默认向上
}

// 辅助函数：检查是否可以向上移动
function canMoveUp(snake: Int32Array): bool {
  const newHeadX = snake[0];
  const newHeadY = snake[1] + 1;
  return isValidMove(newHeadX, newHeadY, snake);
}

// 辅助函数：检查是否可以向右移动
function canMoveRight(snake: Int32Array): bool {
  const newHeadX = snake[0] + 1;
  const newHeadY = snake[1];
  return isValidMove(newHeadX, newHeadY, snake);
}

// 辅助函数：检查是否可以向下移动
function canMoveDown(snake: Int32Array): bool {
  const newHeadX = snake[0];
  const newHeadY = snake[1] - 1;
  return isValidMove(newHeadX, newHeadY, snake);
}

// 辅助函数：检查是否可以向左移动
function canMoveLeft(snake: Int32Array): bool {
  const newHeadX = snake[0] - 1;
  const newHeadY = snake[1];
  return isValidMove(newHeadX, newHeadY, snake);
}

// 辅助函数：检查移动是否有效
function isValidMove(x: i32, y: i32, snake: Int32Array): bool {
  // 检查是否超出边界
  if (x < 1 || x > 8 || y < 1 || y > 8) {
    return false;
  }

  // 检查是否会撞到自己身体（跳过蛇尾，因为蛇移动后尾部会离开原位置）
  for (let i = 2; i < 6; i += 2) { // 只检查第2、3节身体
    if (x === snake[i] && y === snake[i+1]) {
      return false;
    }
  }

  return true;
}

////////////////////
////////////////////
////////////////////


