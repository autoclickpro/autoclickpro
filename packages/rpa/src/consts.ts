import dotenv from "dotenv";
import { QueryOption } from "./type";
dotenv.config();

export const Base_API = process.env["AUTOCLICK_BASE_URL"] || "https://api.autoclickpro.com";

export const defaultQueryOption = {
  timeout: 10000,
  inPane: "wholeScreen",
  selectNth: 1,
  scrollingSearch: false,
  selectTheOneCloseTo: undefined,
} satisfies QueryOption;

export const RPA_ERROR_ID = {
  checkStability: 1,
};
