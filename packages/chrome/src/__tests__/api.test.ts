import test from "node:test";
import assert from "node:assert";
import path from "node:path";
import { findBoxByText } from "../api";

test("api", async () => {
  const file = path.resolve(__dirname, "./sc.png");
  const res = await findBoxByText(file, "script");
  assert.equal(res.list.length, 3);
});
