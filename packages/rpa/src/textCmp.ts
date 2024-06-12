export const textCmp = {
  isEqual(a: string, b: string) {
    return a.replace(/\W/g, "").toLowerCase() === b.replace(/\W/g, "").toLowerCase();
  },
  include(a: string, b: string) {
    return a.replace(/\W/g, "").toLowerCase().includes(b.replace(/\W/g, "").toLowerCase());
  },
};
