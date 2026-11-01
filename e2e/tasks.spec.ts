import { expect, test } from "@playwright/test";

function uniqueTitle() {
  return `E2E ${Date.now()} ${Math.random().toString(36).slice(2, 8)}`;
}

test("SSR includes sample tasks in the response HTML", async ({ request }) => {
  const response = await request.get("/");

  expect(response.ok()).toBeTruthy();
  // The server-rendered HTML contains task content before any browser JavaScript runs.
  expect(await response.text()).toContain("Sample task");
});

test("shows required-title validation without leaving the form", async ({ page }) => {
  await page.goto("/tasks/new");
  await page.getByRole("button", { name: "Create task" }).click();

  await expect(page.locator("#title-error")).toHaveText("Title is required.");
  await expect(page).toHaveURL(/\/tasks\/new$/);
});

test("creates a task and shows it at the top of the list", async ({ page }) => {
  const title = uniqueTitle();
  await page.goto("/tasks/new");
  await page.getByLabel("Title").fill(title);
  await page.getByLabel("Description (optional)").fill("Created by the E2E suite");
  await page.getByRole("button", { name: "Create task" }).click();

  await expect(page.getByText("Task created successfully.")).toBeVisible();
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("heading", { name: title, exact: true }).first()).toBeVisible();
});

test("edits a task", async ({ page }) => {
  const title = uniqueTitle();
  const updatedTitle = `${title} updated`;
  await page.goto("/tasks/new");
  await page.getByLabel("Title").fill(title);
  await page.getByRole("button", { name: "Create task" }).click();

  await expect(page.getByRole("heading", { name: title, exact: true }).first()).toBeVisible();
  await page.getByRole("link", { name: `Edit task ${title}` }).click();
  await page.getByLabel("Title").fill(updatedTitle);
  await page.getByRole("button", { name: "Save changes" }).click();

  await expect(page.getByText("Task updated successfully.")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: updatedTitle, exact: true }).first(),
  ).toBeVisible();
});

test("deletes a task after confirmation", async ({ page }) => {
  const title = uniqueTitle();
  await page.goto("/tasks/new");
  await page.getByLabel("Title").fill(title);
  await page.getByRole("button", { name: "Create task" }).click();

  await expect(page.getByRole("heading", { name: title, exact: true }).first()).toBeVisible();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: `Delete task ${title}` }).click();

  await expect(page.getByText("Task deleted successfully.")).toBeVisible();
  await expect(page.getByRole("heading", { name: title, exact: true })).toHaveCount(0);
});

test("shows the 404 page when editing a task that does not exist", async ({ page }) => {
  await page.goto("/tasks/id-que-nao-existe/edit");

  await expect(page.getByRole("heading", { name: "Not found" })).toBeVisible();
});

test("loads the next page when scrolling to the bottom", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText(/^Showing 10 of/)).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(page.getByText(/^Showing 20 of/)).toBeVisible();
});
