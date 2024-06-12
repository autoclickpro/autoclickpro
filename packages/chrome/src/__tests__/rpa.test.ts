import test from "node:test";
import assert from "node:assert";
import { findBoxByText } from "../api";
import { createRpa } from "../rpa";
import { addRedBorder } from "../utils";

// test("rpa", async t => {
//   const sc = await createRpa();
//   await sc.findAndClickText("script");
//   assert.equal(1, 1);
// });

test("border", async t => {
  await addRedBorder({ x: 0, y: 0, width: 100, height: 100 }, "./sc.png");
  assert.equal(1, 1);
});
