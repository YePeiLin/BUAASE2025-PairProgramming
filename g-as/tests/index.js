// import assert from "assert";
// import { add } from "../build/debug.js";
// assert.strictEqual(add(1, 2), 3);
// console.log("ok");

import assert from "assert";
import { greedy_snake_move } from "../build/debug.js";
assert.strictEqual(greedy_snake_move([4,4,4,5,4,6,4,7], [8,4]), 1);
console.log("right ok");
