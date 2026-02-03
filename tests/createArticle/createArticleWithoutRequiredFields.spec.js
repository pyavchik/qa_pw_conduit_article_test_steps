import { test } from '@playwright/test';
import { SignUpPage } from '../../src/pages/SignUpPage';
import { HomePage } from '../../src/pages/HomePage';
import { CreateArticlePage } from '../../src/pages/CreateArticlePage';
import { faker } from '@faker-js/faker';

let homePage;
let createArticlePage;

test.beforeEach(async ({ page }) => {
  const signUpPage = new SignUpPage(page);
  homePage = new HomePage(page);
  createArticlePage = new CreateArticlePage(page);

  const user = {
    username: `${faker.person.firstName()}_${faker.person.lastName()}`,
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  await signUpPage.open();
  await signUpPage.fillUsernameField(user.username);
  await signUpPage.fillEmailField(user.email);
  await signUpPage.fillPasswordField(user.password);
  await signUpPage.clickSignUpButton();
  await homePage.assertYourFeedTabIsVisible();
  await homePage.clickNewArticleLink();
});

test('Create an article without required fields', async () => {
  await createArticlePage.clickPublishArticleButton();
  await createArticlePage.assertErrorMessageContainsText(
    "title can't be blank",
  );
});

test('Create an article with required and optional fields', async () => {
  await createArticlePage.fillArticleTitleField('Article title!!!');
  await createArticlePage.fillWhatsThisArticleAboutField(
    'Short description of the article',
  );
  await createArticlePage.fillWriteYourArticleTextarea(
    'Full article body text in markdown.',
  );
  await createArticlePage.fillEnterTagsField('playwright');
  await createArticlePage.clickPublishArticleButton();
  await createArticlePage.assertArticleCreated();
});

test('Create an article without article description', async () => {
  await createArticlePage.fillArticleTitleField('Article without description');
  await createArticlePage.fillWriteYourArticleTextarea('Article body text.');
  await createArticlePage.fillEnterTagsField('test');
  await createArticlePage.clickPublishArticleButton();
  await createArticlePage.assertErrorMessageContainsText(
    "description can't be blank",
  );
});

test('Create an article without article text', async () => {
  await createArticlePage.fillArticleTitleField('Article without text');
  await createArticlePage.fillWhatsThisArticleAboutField('Description only');
  await createArticlePage.fillEnterTagsField('test');
  await createArticlePage.clickPublishArticleButton();
  await createArticlePage.assertErrorMessageContainsText(
    "body can't be blank",
  );
});

test('Create an article without article tag', async () => {
  await createArticlePage.fillArticleTitleField('Article without tag');
  await createArticlePage.fillWhatsThisArticleAboutField(
    'Description for the article',
  );
  await createArticlePage.fillWriteYourArticleTextarea('Article body content.');
  await createArticlePage.clickPublishArticleButton();
  await createArticlePage.assertArticleCreated();
});
