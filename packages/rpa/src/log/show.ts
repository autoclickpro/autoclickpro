// const { exec } = require('child_process');
// const path = require('path');

import { run } from "@autoclickpro/run";
import { $ } from "zx";

run({
  async task1() {
    await $`osascript ./text.scpt "hello"`;
  },
});
