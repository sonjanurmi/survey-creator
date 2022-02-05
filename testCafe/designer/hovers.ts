import { ClientFunction, Selector } from "testcafe";
import { setJSON, url } from "../helper";
const title = "Page hover";

fixture`${title}`.page`${url}`.beforeEach(
  async (t) => {
    await t.maximizeWindow();
  }
);

const json = {
  questions: [
    {
      type: "checkbox",
      name: "string_editor",
      choices: [
        "item1",
        "item2",
        "item3"
      ]
    }
  ]
};

const json_pages = {
  "pages": [
    {
      "name": "page1",
      "elements": [
        {
          "type": "text",
          "name": "question",
          "isRequired": true
        }
      ]
    },
    {
      "name": "page2",
      "elements": [
        {
          "type": "text",
          "name": "question1"
        }
      ]
    }
  ]
};

test("Page hover test", async t => {
  await setJSON(json);
  await ClientFunction(() => {
    window["creator"].pageHoverDelay = 2000;
  })();
  await t
    .maximizeWindow();

  const page = Selector(".svc-page__content");
  const question = Selector(".svc-question__adorner");
  await t.hover(page, { offsetX: 5, offsetY: 5 })
    .expect(page.hasClass("svc-hovered-ready")).ok({ timeout: 500 })
    .expect(page.hasClass("svc-hovered")).notOk({ timeout: 200 })
    .expect(page.hasClass("svc-hovered")).ok({ timeout: 3000 })
    .hover(Selector(".svc-toolbox"))
    .expect(page.hasClass("svc-hovered")).notOk({ timeout: 500 })
    .hover(question, { offsetX: 5, offsetY: 5 })
    .expect(question.hasClass("svc-hovered")).ok({ timeout: 500 })
    .wait(3000)
    .expect(page.hasClass("svc-hovered")).notOk();

  await ClientFunction(() => {
    window["creator"].pageHoverDelay = 200;
  })();
});

test("Page hover on Add Question button", async t => {
  await setJSON(json);
  await t
    .maximizeWindow();
  const page = Selector(".svc-page__content");
  const question = Selector(".svc-page__add-new-question");
  await t
    .hover(question, { offsetX: 5, offsetY: 5 })
    .wait(300)
    .expect(page.hasClass("svc-hovered")).notOk();
});

test("Page navigator hover", async t => {
  await setJSON(json_pages);
  await t
    .maximizeWindow();
  const pageHoverSelector = Selector(".svc-page-navigator-item__banner").withExactText("page2");

  await t
    .hover(Selector(".svc-page-navigator-item__dot[title=\"page2\"]"))
    .expect(pageHoverSelector.visible).ok();
  const zIndex = await pageHoverSelector.getStyleProperty("z-index");
  await t
    .expect(parseInt(zIndex))
    .gte(20);
});