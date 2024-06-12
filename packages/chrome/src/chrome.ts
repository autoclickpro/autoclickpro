import { Button, Key, Region, centerOf, keyboard, mouse, straightTo } from "@nut-tree/nut-js";

export const chrome = {
  addressBar: { x: 500, y: 86, width: 300, height: 20 },
  async goToUrl(url: string) {
    await this.activeAddressbar();
    await keyboard.pressKey(Key.LeftCmd, Key.A);
    await keyboard.releaseKey(Key.LeftCmd, Key.A);
    await keyboard.pressKey(Key.Delete);
    await keyboard.pressKey(Key.Delete);
    await keyboard.type(url);
    await keyboard.type(Key.Space);
    await keyboard.pressKey(Key.Enter);
    await keyboard.releaseKey(Key.Enter);
  },
  async closeTab() {
    await keyboard.pressKey(Key.LeftCmd, Key.W);
    await keyboard.releaseKey(Key.LeftCmd, Key.W);
  },
  async activeCurrentTab() {
    await keyboard.pressKey(Key.LeftCmd, Key.L);
    await keyboard.releaseKey(Key.LeftCmd, Key.L);
  },
  async activeAddressbar() {
    await mouse.move(
      straightTo(
        centerOf(
          new Region(
            this.addressBar.x,
            this.addressBar.y,
            this.addressBar.width,
            this.addressBar.height
          )
        )
      )
    );
    await mouse.click(Button.LEFT);
  },
  async openNewTab() {
    await keyboard.pressKey(Key.LeftCmd, Key.T);
    await keyboard.releaseKey(Key.LeftCmd, Key.T);
  },
  async active() {
    this.activeAddressbar();
  },
};
