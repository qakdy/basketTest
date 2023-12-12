const { test, expect } = require('@playwright/test');
const LoginPage = require('../pageobjects/loginpage'); 
const MainPage = require('../pageobjects/mainpage');
const BasketPage =  require('../pageobjects/basketpage');
const { mainModule } = require('process');

let page, loginPage, mainpage, basketpage;

test.beforeAll('Авторизация', async ({ browser }) => {
  page = await browser.newPage();
  loginPage = new LoginPage(page);
  mainpage =  new MainPage(page);
  basketpage = new BasketPage(page);

  //Авторизация с кредами 'test', 'test'
  await loginPage.loginWithCredentials();

  // Проверяем на пустую корзину
  await mainpage.processBasket();

  // Пользователь авторизован в системе
  const usernameText = await mainpage.getElementText(mainpage.username);
  expect(usernameText).toContain('TEST');

  //Корзина пустая
  const basketCountItemsText = await mainpage.getElementText(mainpage.basketCountItems);
  expect(basketCountItemsText).toContain('0');

});

test('Тест-кейс 1. Переход в пустую корзину.', async () => {
  // Кликнуть на иконку корзины
  await mainpage.waitForBasketIconVisible();
  const isBasketIconVisible = await mainpage.page.isVisible('.basket_icon');
  expect(isBasketIconVisible).toBeTruthy();
  await mainpage.clickBasketIcon();

  // Всплывает окно корзины
  const baketwindowClasses = await mainpage.getElementClasses(mainpage.basketWindow)
  const hasShowClass = baketwindowClasses.includes('show');
  expect(hasShowClass).toBeTruthy();

  // В окне корзины нажать кнопку Перейти в корзину
  const goToBasketBtn = await mainpage.getElementText(mainpage.gotoBasketBtn);
  expect(goToBasketBtn).toContain('Перейти в коризну');
  await mainpage.clickgotoBasketBtn();

  // Переход на страницу корзины
  await mainpage.navigateToBasketPage();
  const header = await basketpage.getHeaderText();
  expect(header).toBe('Корзина');

});

test('Тест-кейс 2. Переход в корзину с 1 неакционным товаром.', async () => {

  // Добавить в корзину один товар без скидки
  const hasPromotionalItem = await mainpage.hasItem(2, 'NonPromotional');
  expect(hasPromotionalItem).toBeTruthy();
  await mainpage.clickProduct(2);

  // Рядом с корзиной отображается цифра 1
  await mainpage.waitForBasketCountNonZero();
  const basketCountItemsText = await mainpage.getElementText(mainpage.basketCountItems);
  expect(basketCountItemsText).toContain('1');
  
  // Кликнуть на иконку корзины
  await mainpage.waitForBasketIconVisible();
  const isBasketIconVisible = await mainpage.page.isVisible('.basket_icon');
  expect(isBasketIconVisible).toBeTruthy();
  await mainpage.clickBasketIcon();

  // Открывается окно корзины, в котором указана цена, наименование товара, общая сумма
  await mainpage.waitSelector(mainpage.basketWindow);

  const baketwindowClasses = await mainpage.getElementClasses(mainpage.basketWindow)
  const hasShowClass = baketwindowClasses.includes('show');
  expect(hasShowClass).toBeTruthy();

  const  TextBasketitemProduct2= await mainpage.getElementText(mainpage.getBasketItemSelector(2, 'BasketTitle'));
  expect(TextBasketitemProduct2).toContain('Блокнот в точку');

  const TextBasketPriceProduct2 = await mainpage.getElementText(mainpage.getBasketItemSelector(2, 'BasketPrice'));
  expect(TextBasketPriceProduct2).toContain('- 400 р.');

  const TextBasketSum = await mainpage.getElementText(mainpage.basketSum);
  expect(TextBasketSum).toContain('400');

  // В окне корзины нажать кнопку Перейти в корзину
  const goToBasketBtn = await mainpage.getElementText(mainpage.gotoBasketBtn);
  expect(goToBasketBtn).toContain('Перейти в корзину');
  await mainpage.clickgotoBasketBtn();

  // Переход на страницу корзины
  await mainpage.navigateToBasketPage();
  const header = await basketpage.getHeaderText();
  expect(header).toBe('Корзина');

});

test('Тест-кейс 3. Переход в корзину с 1 акционным товаром.', async () => {
  // Добавить в корзину один товар со скидкой
  const hasPromotionalItem = await mainpage.hasItem(3, 'Promotional');
  expect(hasPromotionalItem).toBeTruthy();
  await mainpage.clickProduct(3);

  // Рядом с корзиной отображается цифра 1
  await mainpage.waitForBasketCountNonZero();
  const basketCountItemsText = await mainpage.getElementText(mainpage.basketCountItems);
  expect(basketCountItemsText).toContain('1');
  
  // Кликнуть на иконку корзины
  const isBasketIconVisible = await mainpage.page.isVisible('.basket_icon');
  expect(isBasketIconVisible).toBeTruthy();
  await mainpage.clickBasketIcon();

  // Открывается окно корзины, в котором указана цена, наименование товара, общая сумма
  await mainpage.waitSelector(mainpage.basketWindow);

  const baketwindowClasses = await mainpage.getElementClasses(mainpage.basketWindow)
  const hasShowClass = baketwindowClasses.includes('show');
  expect(hasShowClass).toBeTruthy();

  const  TextBasketitemProduct2= await mainpage.getElementText(mainpage.getBasketItemSelector(3, 'BasketTitle'));
  expect(TextBasketitemProduct2).toContain('Игра престолов');

  const TextBasketPriceProduct2 = await mainpage.getElementText(mainpage.getBasketItemSelector(3, 'BasketPrice'));
  expect(TextBasketPriceProduct2).toContain('- 285 р.');

  const TextBasketSum = await mainpage.getElementText(mainpage.basketSum);
  expect(TextBasketSum).toContain('285');

  // В окне корзины нажать кнопку Перейти в корзину
  const goToBasketBtn = await mainpage.getElementText(mainpage.gotoBasketBtn);
  expect(goToBasketBtn).toContain('Перейти в корзину');
  await mainpage.clickgotoBasketBtn();

  // Переход на страницу корзины
  await mainpage.navigateToBasketPage();
  const header = await basketpage.getHeaderText();
  expect(header).toBe('Корзина');

});

test('Тест-кейс 4. Переход в корзину с 9 разными товарами.', async () => {
  // Добавляем один акционный товар заранее
  await mainpage.clickPageLink(2);
  await mainpage.clickProduct(14);
  await mainpage.waitForBasketCountNonZero();
  const basketCountItemsTextOne = await mainpage.getElementText(mainpage.basketCountItems);
  expect(basketCountItemsTextOne).toContain('1');
  await mainpage.clickPageLink(1);
  await mainpage.waitForBasketCountNonZero();

  // Добавить в корзину ещё 8 разных товаров
  for (let productId = 1; productId <= 8; productId++) {
    await mainpage.clickProduct(productId);
  }
  await mainpage.waitForBasketCountNine();
  const basketCountItemsTextNine = await mainpage.getElementText(mainpage.basketCountItems);
  expect(basketCountItemsTextNine).toContain('9');

  // Кликнуть на иконку корзины
  const isBasketIconVisible = await mainpage.page.isVisible('.basket_icon');
  expect(isBasketIconVisible).toBeTruthy();
  await mainpage.clickBasketIcon();

  // Открывается окно корзины, в котором указана цена, наименование товара, общая сумма
  await mainpage.waitSelector(mainpage.basketWindow);

  const baketwindowClasses = await mainpage.getElementClasses(mainpage.basketWindow)
  const hasShowClass = baketwindowClasses.includes('show');
  expect(hasShowClass).toBeTruthy();

  const productsToCheck = [
    { productId: 1, expectedTitle: 'Творческий беспорядок', expectedPrice: '- 400 р.' },
    { productId: 2, expectedTitle: 'Блокнот в точку', expectedPrice: '- 400 р.' },
    { productId: 3, expectedTitle: 'Игра престолов', expectedPrice: '- 285 р.' },
    { productId: 4, expectedTitle: 'Кошечка Мари', expectedPrice: '- 442 р.' },
    { productId: 5, expectedTitle: 'Нотная тетрадь', expectedPrice: '- 499 р.' },
    { productId: 6, expectedTitle: 'Black&Red', expectedPrice: '- 315 р.' },
    { productId: 7, expectedTitle: 'Гусь. Дедлайн', expectedPrice: '- 750 р.' },
    { productId: 8, expectedTitle: 'Художник', expectedPrice: '- 420 р.' },
    { productId: 14, expectedTitle: 'Как перестать беспокоиться', expectedPrice: '- 450 р.' },
  ];

  await mainpage.checkBasketItems(productsToCheck);

  const TextBasketSum = await mainpage.getElementText(mainpage.basketSum);
  expect(TextBasketSum).toContain('3961');

  // В окне корзины нажать кнопку Перейти в корзину
  const goToBasketBtn = await mainpage.getElementText(mainpage.gotoBasketBtn);
  expect(goToBasketBtn).toContain('Перейти в корзину');
  await mainpage.clickgotoBasketBtn();

  // Переход на страницу корзины
  await mainpage.navigateToBasketPage();
  const header = await basketpage.getHeaderText();
  expect(header).toBe('Корзина');

});

test('Тест-кейс 5. Переход в корзину с 9 акционными товарами одного наименования.', async () => {

  // Добавить в корзину один товар со скидкой
  const hasPromotionalItem = await mainpage.hasItem(1, 'Promotional');
  expect(hasPromotionalItem).toBeTruthy();

  // Вводим в поле карточки товара количество товара: 9
  const updatedValue = await mainpage.modifyInputField(1, '9');
  expect(updatedValue).toBe('9');

  // Нажимаем кнопку Купить на карточки товара
  await mainpage.clickProduct(1);

  // Рядом с корзиной отображается цифра 9
  await mainpage.waitForBasketCountNonZero();
  const basketCountItemsText = await mainpage.getElementText(mainpage.basketCountItems);
  expect(basketCountItemsText).toContain('9');
  
  // Кликнуть на иконку корзины
  const isBasketIconVisible = await mainpage.page.isVisible('.basket_icon');
  expect(isBasketIconVisible).toBeTruthy();
  await mainpage.clickBasketIcon();

  // Открывается окно корзины, в котором указана цена, наименование товара, общая сумма
  await mainpage.waitSelector(mainpage.basketWindow);

  const baketwindowClasses = await mainpage.getElementClasses(mainpage.basketWindow)
  const hasShowClass = baketwindowClasses.includes('show');
  expect(hasShowClass).toBeTruthy();

  const  TextBasketitemProduct2= await mainpage.getElementText(mainpage.getBasketItemSelector(1, 'BasketTitle'));
  expect(TextBasketitemProduct2).toContain('Творческий беспорядок');

  const TextBasketPriceProduct2 = await mainpage.getElementText(mainpage.getBasketItemSelector(1, 'BasketPrice'));
  expect(TextBasketPriceProduct2).toContain('- 400 р.');

  const TextBasketSum = await mainpage.getElementText(mainpage.basketSum);
  expect(TextBasketSum).toContain('3600');

  // В окне корзины нажать кнопку Перейти в корзину
  const goToBasketBtn = await mainpage.getElementText(mainpage.gotoBasketBtn);
  expect(goToBasketBtn).toContain('Перейти в корзину');
  await mainpage.clickgotoBasketBtn();

  // Переход на страницу корзины
  await mainpage.navigateToBasketPage();
  const header = await basketpage.getHeaderText();
  expect(header).toBe('Корзина');

});

test.afterEach(async () => {
  // Закрывает страницу
  await page.close();
});
