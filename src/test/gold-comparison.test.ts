import { readFileSync } from "node:fs";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { goldMarkup } from "@/lib/shop/goldMarkup";

const script = readFileSync("public/gold/app.js", "utf8");

// jsdom ships <dialog> without its modal methods, while the shop opens the
// comparison with showModal(). Give the test run the minimal behaviour.
beforeAll(() => {
  const proto = HTMLDialogElement.prototype as unknown as Record<string, unknown>;
  if (!proto.showModal) {
    proto.showModal = function (this: HTMLDialogElement) {
      this.open = true;
    };
    proto.close = function (this: HTMLDialogElement) {
      this.open = false;
      this.dispatchEvent(new Event("close"));
    };
  }
});

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

  it("offers a clear button with the selection and empties it on demand", () => {
    const result = run(`
      const dock = $('comparedock'), clear = $('clearcompare');
      const states = [dock.hidden, clear.hidden];
      toggleCompare(1); states.push(dock.hidden, clear.hidden);
      toggleCompare(2); states.push(dock.hidden, clear.hidden);
      clearCompare();
      states.push(dock.hidden, clear.hidden, compareIds.length,
        document.querySelectorAll('.comparecheck input:checked').length);
      return states;
    `);
    expect(result).toEqual([true, true, true, true, false, false, true, true, 0, 0]);
  });

  it("adds a product to the cart straight from the comparison dialog", () => {
    const result = run(`
      toggleCompare(1); toggleCompare(2);
      openCompare();
      const buttons = [...document.querySelectorAll('.buyrow button')];
      const before = $('count').textContent;
      buttons[0].click();
      return {
        buttons: buttons.length,
        labels: buttons.map(b => b.textContent.trim()),
        before,
        after: $('count').textContent,
        note: document.getElementById('compareqty-1').textContent,
        inCart: cart[1],
        stillOpen: $('modalbody').querySelector('#comparison-title') !== null
      };
    `);
    expect(result).toEqual({
      buttons: 2,
      labels: ["＋ В количката", "＋ В количката"],
      before: "0",
      after: "1",
      note: "В количката: 1 бр.",
      inCart: 1,
      stillOpen: true,
    });
  });
});