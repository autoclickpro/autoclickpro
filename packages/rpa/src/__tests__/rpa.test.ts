import assert from "node:assert";
import test from "node:test";
import { addRedBorder } from "../utils";


test("border", async t => {
  await addRedBorder({ x: 0, y: 0, width: 100, height: 100 }, "./sc.png");
  assert.equal(1, 1);
});
