import { Key, Point, keyboard, mouse, screen, sleep, straightTo } from "@nut-tree/nut-js";
import fs from "node:fs";
import * as api from "./api";
import { RPA_ERROR_ID, defaultQueryOption } from "./consts";
import { getBoxFromInPane } from "./pane";
import { Box, IconName, QueryOption, Word } from "./type";
import {
  assert,
  box2Region,
  centerOfBox,
  dbgScreen,
  getBoxInScreen,
  isAtEndOfPage,
  moveToCenterOfBox,
  waitUntilImageStable,
} from "./utils";

keyboard.config.autoDelayMs = 20;

/**
 * it will not scroll down automatically to find the element
 * @param q
 * @param option
 * @returns
 */
async function query(
  q: (sc: Buffer) => Promise<Box[]>,
  option: QueryOption = defaultQueryOption,
  info = ""
): Promise<Box> {
  const {
    timeout = defaultQueryOption["timeout"],
    selectNth = defaultQueryOption["selectNth"],
    inPane = defaultQueryOption["inPane"],
    selectTheOneCloseTo = defaultQueryOption["selectTheOneCloseTo"],
    scrollingSearch = defaultQueryOption["scrollingSearch"],
  } = option;
  assert(!selectNth || selectNth > 0, "nth should be greater than 0");
  const grabBox = await getBoxFromInPane(inPane);

  const now = Date.now();
  while (Date.now() - now < timeout + (selectTheOneCloseTo ? 6000 : 0)) {
    try {
      // await waitUntilImageStable(grabBox, timeout);
      const sc = await screen.captureRegion("sc.png", box2Region(grabBox));
      const buffer = fs.readFileSync(sc);
      const list = await q(buffer);
      if (list.length === 0) {
        throw new Error(`not found one time`);
      }
      await dbgScreen(
        list.map(e => getBoxInScreen(grabBox, e)),
        sc,
        `dbg/screenshot-${info}.png`
      );

      let box;
      //closeToAnchor has higher priority
      if (selectTheOneCloseTo) {
        const anchorBox = await query(async sc => {
          if (selectTheOneCloseTo.type === "text") {
            return (await api.findBoxByText(sc, selectTheOneCloseTo.text)).list.map(e => e.box);
          } else {
            return (await api.findBoxByIcon(sc, selectTheOneCloseTo.icon)).list;
          }
        });
        const center = centerOfBox(anchorBox);
        const boxs = list.map(box => {
          return { box, distance: Math.sqrt((center.x - box.x) ** 2 + (center.y - box.y) ** 2) };
        });
        box = boxs.sort((a, b) => a.distance - b.distance)[0].box;
      } else if (selectNth > 0) {
        box = list[selectNth - 1];
        assert(!!box, `not found the ${selectNth}th box`);
      } else {
        throw new Error(`impossible, or argument error`);
      }
      console.log("find box", box);
      return getBoxInScreen(grabBox, box);
    } catch (e: any) {
      if (e.code === RPA_ERROR_ID.checkStability) {
        throw e;
      }
      console.log(e.message);
      const isAtEnd = await isAtEndOfPage(grabBox);
      if (scrollingSearch && !isAtEnd) {
        console.log("===>page down to find");
        await keyboard.pressKey(Key.PageDown);
        await keyboard.releaseKey(Key.PageDown);
        await mouse.scrollUp(20);
      }
    }
  }
  throw new Error(`timeout: ${info} not found `);
}

/**
 * wait for the text to appear
 * @param text
 */
export function createRpa({ dbg = true } = {}) {
  screen.config.highlightDurationMs = 1000 * 30;
  async function findBoxByIcon(iconName: IconName, option: QueryOption = defaultQueryOption) {
    dbg && console.log("==>findIcon", iconName);
    return await query(async sc => (await api.findBoxByIcon(sc, iconName)).list, option, iconName);
  }
  async function findBoxByText(text: string, option: QueryOption = defaultQueryOption) {
    dbg && console.log("==>findText", text);
    return await query(
      async sc => (await api.findBoxByText(sc, text)).list.map(e => e.box),
      option,
      text
    );
  }
  //calculateHammingDistance(image similarity)
  async function waitForElementToAppear() {
    await sleep(2000);
  }

  return {
    async clickText(text: string, option: QueryOption = defaultQueryOption) {
      dbg && console.log("==>clickText", text);
      const box = await findBoxByText(text, option);
      await this.clickBox(box);
    },

    async clickIcon(iconName: IconName, option: QueryOption = defaultQueryOption) {
      dbg && console.log("==>clickIcon", iconName);
      const box = await findBoxByIcon(iconName, option);
      await this.clickBox(box);
    },
    async hasText(text: string, option: QueryOption = defaultQueryOption) {
      dbg && console.log("==>hasText", text);
      try {
        return !!(await query(
          async sc => (await api.findBoxByText(sc, text)).list.map(e => e.box),
          option,
          text
        ));
      } catch (e: any) {
        console.log("===>hasTextExe", e);
        if (e.code === RPA_ERROR_ID.checkStability) {
          throw e;
        }
        return false;
      }
    },
    async clickBox(box: Box, option: { pos: "center" | "leftCenter" } = { pos: "center" }) {
      await moveToCenterOfBox(box);
      let clickPoint: Point | null = null;
      switch (option.pos) {
        case "leftCenter":
          clickPoint = { x: box.x + 10, y: box.y + box.height / 2 };
          break;
        case "center":
        default:
          clickPoint = centerOfBox(box);
      }
      mouse.move(straightTo(clickPoint));
      await mouse.leftClick();
    },
    async click(point: Point) {
      mouse.move(straightTo(point));
      await mouse.leftClick();
    },

    async hasIcon(iconName: IconName, option: QueryOption = defaultQueryOption) {
      dbg && console.log("==>hasIcon", iconName);
      try {
        return !!(await query(
          async sc => (await api.findBoxByIcon(sc, iconName)).list,
          option,
          iconName
        ));
      } catch (e: any) {
        console.log("===>hasIconExeception:", e);
        if (e.code === RPA_ERROR_ID.checkStability) {
          throw e;
        }
        return false;
      }
    },
    async typewrite(text: string) {
      await keyboard.type(text);
      console.log("input is ", text);
    },
    async clear() {
      await keyboard.pressKey(Key.LeftCmd, Key.A);
      await keyboard.releaseKey(Key.LeftCmd, Key.A);
      await keyboard.pressKey(Key.Delete);
    },
    async pressKey(...keys: Key[]) {
      await keyboard.pressKey(...keys);
      await keyboard.releaseKey(...keys);
    },
    async ocr({ inPane }: QueryOption) {
      const grabBox = await getBoxFromInPane(inPane);
      const sc = await screen.captureRegion("dbg/sc.png", box2Region(grabBox));
      const buffer = fs.readFileSync(sc);
      const { list } = await api.findWords(buffer);
      const listInScreen = list.map(e => ({ ...e, box: getBoxInScreen(grabBox, e.box) }));
      await fs.writeFileSync("dbg/ocr.json", JSON.stringify(listInScreen, null, 2));
      return listInScreen;
    },

    async scroll(step: "pageDown" | "pageUp" | "toBottom" | "toTop" | { x: number; y: number }) {
      switch (step) {
        case "pageDown":
          await keyboard.pressKey(Key.PageDown);
          await keyboard.releaseKey(Key.PageDown);
          break;
        case "pageUp":
          await keyboard.pressKey(Key.PageUp);
          await keyboard.releaseKey(Key.PageUp);
          break;
        case "toBottom":
          await keyboard.pressKey(Key.End);
          await keyboard.releaseKey(Key.End);
          break;
        case "toTop":
          await keyboard.pressKey(Key.Home);
          await keyboard.releaseKey(Key.Home);
          break;
        default:
          if ("x" in step && "y" in step) {
            const { x, y } = step;
            if (y < 0) {
              await mouse.scrollUp(-y);
            } else if (y > 0) {
              await mouse.scrollDown(y);
            }
            if (x < 0) {
              await mouse.scrollLeft(-x);
            } else if (x > 0) {
              await mouse.scrollRight(x);
            }
            return;
          }
          throw new Error("unsupported scroll");
      }
    },
  };
}

export const rpa = createRpa({ dbg: true });
