import {
  Region,
  centerOf,
  mouse,
  straightTo,
  Image,
  screen,
  sleep,
  keyboard,
  Key,
} from "@nut-tree/nut-js";
import { Box, Point, ScreenLoc } from "./type";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import looksSame from "looks-same";
import { fs as zfs } from "zx";

import { RPAError } from "./error";
import { RPA_ERROR_ID } from "./consts";

export function box2Region(box: Box) {
  return new Region(box.x, box.y, box.width, box.height);
}

export async function moveToCenterOfBox(box: Box) {
  await mouse.move(straightTo(centerOf(box2Region(box))));
}
export async function moveToPoint(p: Point) {
  await mouse.move(straightTo(p));
}
/**
 * check the two image is the same
 */
export function isSameImage(img1: Image, img2: string) {
  return true;
}

export function centerOfBox(box: Box) {
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}

export function assert(condition: boolean, msg: string): asserts condition {
  if (!condition) {
    throw new Error(msg);
  }
}
export async function hightlightMatch(boxes: Box[]) {
  for (const box of boxes) {
    screen.highlight(box2Region(box));
  }
}

export function getBoxInScreen(grabBox: Box, subbox: Box) {
  return {
    x: grabBox.x + subbox.x,
    y: grabBox.y + subbox.y,
    width: subbox.width,
    height: subbox.height,
  };
}
export async function addRedBorder(boxes: Box[], background: string, output: string) {
  const borderThickness = 2;
  const color = { r: 255, g: 0, b: 0, alpha: 1 };
  const base = { background: color, channels: 4 as sharp.Channels };
  const layers = boxes.map(box => {
    return [
      // left border
      {
        input: {
          create: {
            ...base,
            width: borderThickness,
            height: box.height,
          },
        },
        top: box.y,
        left: box.x,
      },
      // right border
      {
        input: {
          create: {
            ...base,
            width: borderThickness,
            height: box.height,
          },
        },
        top: box.y,
        left: box.width + box.x - borderThickness,
      },
      // top border
      {
        input: {
          create: {
            ...base,
            width: box.width,
            height: borderThickness,
          },
        },
        top: box.y,
        left: box.x,
      },
      // bottom border
      {
        input: {
          create: {
            ...base,
            width: box.width,
            height: borderThickness,
          },
        },
        top: box.y + box.height - borderThickness,
        left: box.x,
      },
    ];
  });
  await sharp(background).composite(layers.flat()).toFile(output);
}

export async function dbgScreen(boxes: Box[], sc: string, output: string) {
  const dir = path.dirname(output);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(output)) {
    fs.writeFileSync(output, "", { flag: "w" });
  }
  await addRedBorder(boxes, sc, output);
}

export async function waitUntilImageStable(grabBox: Box, timeout: number) {
  let isStable = false;
  let begin = Date.now();
  while (!isStable && Date.now() - begin < timeout) {
    const first = await screen.captureRegion("sc_a.png", box2Region(grabBox));
    await sleep(500);
    const second = await screen.captureRegion("sc_b.png", box2Region(grabBox));
    const { equal } = await looksSame(first, second, {
      createDiffImage: true,
    });
    if (equal) {
      zfs.removeSync("sc_a.png");
      zfs.removeSync("sc_b.png");
      isStable = true;
    }
  }
  if (!isStable) {
    throw new RPAError("timeout when check image stable", RPA_ERROR_ID.checkStability);
  }
}
/**
 * if you cannot scroll down anymore, then you are at the end of the page
 * @param grabBox: the box you care about, such as the long list. if you always choose whole screen, there are some problems if the swiper existed
 * @returns
 */
export async function isAtEndOfPage(grabBox: Box) {
  const first = await screen.captureRegion("sc-1.png", box2Region(grabBox));
  await keyboard.pressKey(Key.PageDown);
  const second = await screen.captureRegion("sc-2.png", box2Region(grabBox));
  const { equal } = await looksSame(first, second);
  if (!equal) {
    await keyboard.pressKey(Key.PageUp);
    await keyboard.releaseKey(Key.PageUp);
  }
  return equal;
}
