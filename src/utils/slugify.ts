export const slugifyStr = (str: string) =>
  str
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

export const slugifyAll = (arr: string[]) => arr.map(str => slugifyStr(str));
