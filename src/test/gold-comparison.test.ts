import { readFileSync } from "node:fs";
import { beforeEach, describe, expect, it } from "vitest";
import { goldMarkup } from "@/lib/shop/goldMarkup";

const script = readFileSync("public/gold/app.js", "utf8");

function run(actions: string) {
  return new Function(`${script}\n${actions}`)();
}

describe("Gold comparison selection", () => {
  beforeEach(() => {
    document.body.innerHTML = goldMarkup;
    localStorage.clear();
  });

  it("requires at least two products before comparison is available", () => {
    const result = run(`
      const button = $('compare');
      const states = [button.hidden];
      toggleCompare(1); states.push(button.hidden);
      toggleCompare(2); states.push(button.hidden);
      toggleCompare(1); states.push(button.hidden);
      return states;
    `);
    expect(result).toEqual([true, true, false, true]);
  });

  it("compares the selected products and preserves the existing three-product limit", () => {
    const result = run(`
      toggleCompare(1); toggleCompare(2); toggleCompare(3); toggleCompare(4);
      return compareIds;
    `);
    expect(result).toEqual([1, 2, 3]);
  });
});