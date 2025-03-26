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
  barriers: Int32Array | null = null
): i32 {
  if (!barriers) barriers = new Int32Array(0); // 确保 barriers 不是 null

  // 调用基于 BFS 的最短路径规划，返回第一步移动方向
  return findShortestPath(snake, food, barriers);
}

function findShortestPath(
  snake: Int32Array,
  food: Int32Array,
  barriers: Int32Array
): i32 {
  const gridSize: i32 = 8;
  const totalCells: i32 = gridSize * gridSize; // 64

  // visited 数组记录是否访问过，每个元素 0/1
  let visited = new Uint8Array(totalCells);
  // parent 保存 BFS 搜索中每个格子的父节点（用 0~63 的索引表示），未访问则为 -1
  let parent = new Int32Array(totalCells);
  // moveFromParent 保存从父节点到该格子所用的方向
  let moveFromParent = new Int32Array(totalCells);
  for (let i = 0; i < totalCells; i++) {
    parent[i] = -1;
    moveFromParent[i] = -1;
  }

  // 队列：这里固定大小为 totalCells，足够覆盖整个 8×8 棋盘
  let queue = new Int32Array(totalCells);
  let front: i32 = 0, rear: i32 = 0;

  // 将蛇头作为起点，计算其在 0~63 中的索引
  let headX = snake[0], headY = snake[1];
  let startIndex = (headX - 1) * gridSize + (headY - 1);
  visited[startIndex] = 1;
  queue[rear++] = startIndex;

  // 定义四个方向的偏移量与对应方向值（与 Directions 枚举对应）
  const dx = [0, -1, 0, 1];
  const dy = [1, 0, -1, 0];
  const dirs = [Directions.UP, Directions.LEFT, Directions.DOWN, Directions.RIGHT];

  // BFS 搜索，记录父节点和移动方向
  let foodIndex: i32 = -1;
  while (front < rear) {
    let current = queue[front++];
    // 根据索引还原坐标：x = index / 8 + 1, y = index % 8 + 1
    let curX = (current / gridSize) + 1;
    let curY = (current % gridSize) + 1;

    // 如果找到食物，记录当前位置索引，退出 BFS
    if (curX == food[0] && curY == food[1]) {
      foodIndex = current;
      break;
    }

    // 遍历四个方向扩展
    for (let i = 0; i < 4; i++) {
      let nx = curX + dx[i];
      let ny = curY + dy[i];
      if (!checkBoundary(nx, ny)) continue;
      if (!checkBodyCollision(nx, ny, snake)) continue;
      if (!checkBarriers(nx, ny, barriers)) continue;
      let nIndex = (nx - 1) * gridSize + (ny - 1);
      if (visited[nIndex]) continue;
      visited[nIndex] = 1;
      parent[nIndex] = current;
      moveFromParent[nIndex] = dirs[i]; // 记录从 current 到 nIndex 的移动方向
      queue[rear++] = nIndex;
    }
  }

  if (foodIndex == -1) {
    return -1; // 食物不可达，返回 UNREACHABLE
  }

  // 反向回溯路径：从 foodIndex 追溯到 startIndex，保存经过的移动方向
  let cur = foodIndex;
  let path: i32[] = [];
  while (cur != startIndex) {
    path.push(moveFromParent[cur]);
    cur = parent[cur];
  }
  // path 数组中的方向顺序为：食物到蛇头，最后一项为起始移动。
  // 返回 path 最后一个元素，即蛇头应执行的第一步
  return path[path.length - 1];
}

function checkBoundary(x: i32, y: i32): bool {
  return x >= 1 && x <= 8 && y >= 1 && y <= 8;
}

function checkBodyCollision(x: i32, y: i32, snake: Int32Array): bool {
  for (let i = 2; i < 6; i += 2) {
    if (x == snake[i] && y == snake[i + 1]) return false;
  }
  return true;
}

function checkBarriers(x: i32, y: i32, barriers: Int32Array): bool {
  for (let i = 0; i < barriers.length; i += 2) {
    if (x == barriers[i] && y == barriers[i + 1]) return false;
  }
  return true;
}
