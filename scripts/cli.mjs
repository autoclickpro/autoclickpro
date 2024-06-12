#!/usr/bin/env tsx

import { run } from "@autoclickpro/run";
import { $ } from "zx";

run({
  async release(option) {
    const { version } = option;
    if (version.startsWith("pre")) {
      await $`lerna version ${version}  --preid beta --conventional-commits --no-commit-hooks -y`;
      await $`pnpm -r publish --tag beta ----report-summary`;
    } else {
      await $`lerna version ${version} --conventional-commits --no-commit-hooks -y`;
      await $`pnpm -r publish ----report-summary`;
    }
  },
});
