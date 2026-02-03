import { expect, test } from '@playwright/test';

export class CreateArticlePage {
  constructor(page) {
    this.page = page;
    this.articleTitleField = page.getByRole('textbox', {
      name: 'Article Title',
    });
    this.whatsThisArticleAboutField = page.getByRole('textbox', {
      name: /What's this article about\?/i,
    });
    this.writeYourArticleTextarea = page.getByRole('textbox', {
      name: 'Write your article (in markdown)',
    });
    this.enterTagsField = page.getByPlaceholder('Enter tags');
    this.publishArticleButton = page.getByRole('button', {
      name: 'Publish Article',
    });
    this.errorMessage = page.getByRole('list').nth(1);
    this.editArticleButton = page.getByRole('link',
      { name: 'Edit Article' }).first();
  }

  async fillArticleTitleField(articleTitle) {
    await test.step(`Fill ${articleTitle} field`, async () => {
      await this.articleTitleField.fill(articleTitle);
    });
  }

  async fillWhatsThisArticleAboutField(about) {
    await test.step(`Fill ${about} field`, async () => {
      await this.whatsThisArticleAboutField.fill(about);
    });
  }

  async fillWriteYourArticleTextarea(articleMarkDown) {
    await test.step(`Fill write your article in markdown
     ${articleMarkDown}`, async () => {
      await this.writeYourArticleTextarea.fill(articleMarkDown);
    });
  }

  async fillEnterTagsField(tag) {
    await test.step(`Fill tag '${tag}' and press Enter`, async () => {
      await this.enterTagsField.fill(tag);
      await this.page.keyboard.press('Enter');
    });
  }

  async clickPublishArticleButton() {
    await test.step(`Click the 'Publish Article' button`, async () => {
      await this.publishArticleButton.click();
    });
  }

  async assertErrorMessageContainsText(messageText) {
    await test.step(`Assert the '${messageText}' error is shown`, async () => {
      await expect(this.errorMessage).toContainText(messageText);
    });
  }

  async assertArticleCreated() {
    await test.step(`Assert the article was created 
    (Edit Article link visible)`, async () => {
      await expect(this.editArticleButton).toBeVisible();
    });
  }
}
