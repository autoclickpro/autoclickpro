import { QueryOption, ScreenLoc } from "./type";
import { screen } from "@nut-tree/nut-js";
import _ from "lodash-es";

const floor = Math.floor.bind(Math);
export async function getBoxOfScreen(pane: ScreenLoc) {
  const screenW = await screen.width();
  const screenH = await screen.height();
  const halfScreenW = floor(screenW / 2);
  const halfScreenH = floor(screenH / 2);
  const cellHeightOf9 = floor(screenH / 3);
  const cellWidthOf9 = floor(screenW / 3);
  const cellHeightOf4 = floor(screenH / 2);
  const cellWidthOf4 = floor(screenW / 2);


  switch (pane) {
    case "leftOf2":
      return { x: 0, y: 0, width: halfScreenW, height: screenH };
    case "rightOf2":
      return { x: halfScreenW, y: 0, width: halfScreenW, height: screenH };
    case "topOf2":
      return { x: 0, y: 0, width: screenW, height: halfScreenH };
    case "bottomOf2":
      return { x: 0, y: halfScreenH, width: screenW, height: halfScreenH };
    case "leftTopOf4":
      return { x: 0, y: 0, width: cellWidthOf4, height: cellHeightOf4 };
    case "rightTopOf4":
      return { x: halfScreenW, y: 0, width: cellWidthOf4, height: cellHeightOf4 };
    case "leftBottomOf4":
      return { x: 0, y: halfScreenH, width: cellWidthOf4, height: cellHeightOf4 };
    case "rightBottomOf4":
      return {
        x: halfScreenW,
        y: halfScreenH,
        width: cellWidthOf4,
        height: cellHeightOf4,
      };

    case "centerOf9":
      return {
        x: floor(screenW * 0.25),
        y: floor(screenH * 0.25),
        width: cellWidthOf9,
        height: cellHeightOf9,
      };
    case "leftTopOf9":
      return {
        x: 0,
        y: 0,
        width: cellWidthOf9,
        height: cellHeightOf9,
      };
    case "rightTopOf9":
      return {
        x: floor(screenW * 0.66),
        y: 0,
        width: cellWidthOf9,
        height: cellHeightOf9,
      };
    case "topCenterOf9":
      return {
        x: floor(screenW * 0.33),
        y: 0,
        width: cellWidthOf9,
        height: cellHeightOf9,
      };
    case "leftBottomOf9":
      return {
        x: 0,
        y: floor(screenH * 0.66),
        width: cellWidthOf9,
        height: cellHeightOf9,
      };
    case "rightBottomOf9":
      return {
        x: floor(screenW * 0.66),
        y: floor(screenH * 0.66),
        width: cellWidthOf9,
        height: cellHeightOf9,
      };
    case "bottomCenterOf9":
      return {
        x: floor(screenW * 0.33),
        y: floor(screenH * 0.66),
        width: cellWidthOf9,
        height: cellHeightOf9,
      };
    case "leftCenterOf9":
      return {
        x: 0,
        y: floor(screenH * 0.33),
        width: cellWidthOf9,
        height: cellHeightOf9,
      };
    case "rightCenterOf9":
      return {
        x: floor(screenW * 0.66),
        y: floor(screenH * 0.33),
        width: cellWidthOf9,
        height: cellHeightOf9,
      };
    case "wholeScreen":
      return {
        x: 0,
        y: 0,
        width: screenW,
        height: screenH,
      };
    default:
      throw new Error("unsupported screen location");
  }
}

export function getBoxFromInPane(inPane: QueryOption["inPane"]) {
  const isBox = _.isObject(inPane) && "x" in inPane;
  switch (typeof inPane) {
    case "function":
      return inPane();
    case "string":
      return getBoxOfScreen(inPane);
    case "object":
      if (isBox) {
        return inPane;
      }
    default:
      throw new Error("no supported type");
  }
}
