export type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Point = {
  x: number;
  y: number;
};

export type IconName = TwitterIcon | ChromeIcon | (string & Record<never, never>);
export type TwitterIcon = "twitter:share" | "twitter:reply" | "twitter:repost" | "twitter:like";
export type ChromeIcon =
  | "chrome:close"
  | "chrome:back"
  | "chrome:forward"
  | "chrome:refresh"
  | "chrome:bookmark"
  | "chrome:stop-refresh"
  | "chrome:home";
export type IconPath = string;
export type Icon = IconName | IconPath | Buffer;
export type Text = string;

export type QueryOption = {
  timeout?: number;
  /**
   * 1-based index
   * nth is the index of the box in the list
   */
  inPane?: Box | (() => Promise<Box>) | ScreenLoc;
  selectNth?: number;
  //anchor is the fixed point of the screen
  selectTheOneCloseTo?: { type: "text"; text: string } | { type: "icon"; icon: IconName };
  scrollingSearch?: boolean;
};

export type ScreenLoc =
  | "leftTopOf4"
  | "rightTopOf4"
  | "leftBottomOf4"
  | "rightBottomOf4"
  | "leftOf2"
  | "rightOf2"
  | "topOf2"
  | "bottomOf2"
  | "centerOf9"
  | "leftTopOf9"
  | "rightTopOf9"
  | "leftBottomOf9"
  | "rightBottomOf9"
  | "topCenterOf9"
  | "bottomCenterOf9"
  | "leftCenterOf9"
  | "rightCenterOf9"
  | "wholeScreen";

export type Offset = {
  dx: number;
  dy: number;
};

export type Word = {
  text: string;
  confidence: number;
  box: Box;
};
