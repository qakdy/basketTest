class MainPage{
    constructor(page){
        this.page = page;
        this.username = '.text-uppercase';
        this.checkbox = '#gridCheck'
        this.basketIcon = '.basket_icon';
        this.basketCountItems = '.basket-count-items';
        this.basketWindow = '.dropdown-menu-right.show';
        this.gotoBasketBtn = '.btn.ml-auto';
        this.emptyBasketBtn = '.btn-danger';
        this.basketSum = 'div.ml-4.mt-4.mb-2 > span.basket_price';
        this.basket = '#dropdownBasket'
    }

    async processBasket() {
        await this.page.waitForSelector('.basket-count-items', { visible: true });
        const basketCountItemsText = await this.getElementText('.basket-count-items');
        const itemCount = parseInt(basketCountItemsText);
    
        if (itemCount === 0) {
        } else if (itemCount === 9) {
            await this.clickProduct(2);
            await this.waitForBasketCountTen();
            await this.clickBasketBtn();
            await this.waitSelector(this.basketWindow);
            await this.clickEmptyBasketBtn();
            await this.waitForBasketCountZero()
        } else if (itemCount >= 1 && itemCount <= 8) {
            await this.clickBasketBtn();
            await this.waitSelector(this.basketWindow);
            await this.clickEmptyBasketBtn();
            await this.waitForBasketCountZero()
        }
    }

    async checkBasketItems(productsToCheck) {
        for (const product of productsToCheck) {
          const textBasketItemProduct = await this.getElementText(this.getBasketItemSelector(product.productId, 'BasketTitle'));
          expect(textBasketItemProduct).toContain(product.expectedTitle);
      
          const textBasketPriceProduct = await this.getElementText(this.getBasketItemSelector(product.productId, 'BasketPrice'));
          expect(textBasketPriceProduct).toContain(product.expectedPrice);
        }
      }

    async clickPageLink(pageNumber) {
        const pageLinkSelector = `a.page-link[data-page-number="${pageNumber}"]`;
        const pageLinkElement = await this.page.$(pageLinkSelector);
        
        if (!pageLinkElement) {
            throw new Error(`Page link not found for page number ${pageNumber}`);
        }

        await pageLinkElement.click();
    }

    getBasketItemSelector(productId, part) {
        const partSelectors = {
          BasketTitle: 'span.basket-item-title',
          BasketPrice: 'span.basket-item-price',
          BasketCount: 'span.basket-item-count',
        };

        const partSelector = partSelectors[part];
        if (!partSelector) {
          throw new Error(`Invalid part specified: ${part}`);
        }
    
        return `li.basket-item[data-product="${productId}"] ${partSelector}`;
    }

    getItemSelector(itemId, part) {
        const partSelectors = {
          NonPromotional: 'div.wrap-ribbon.d-none',
          Promotional: 'div.wrap-ribbon',
          ItemInput: '.form-control'
        };

        const partSelector = partSelectors[part];
        if (!partSelector) {
          throw new Error(`Invalid part specified: ${part}`);
        }
    
        return `div.note-item[data-product="${itemId}"] ${partSelector}`;
    }

    async modifyInputField(itemId, newValue) {
        const inputField = await this.page.$(this.getItemSelector(itemId, 'ItemInput'));
        
        if (!inputField) {
          throw new Error(`Input field not found for item ${itemId}`);
        }
    
        await inputField.click({ clickCount: 3 }); 
        await this.page.keyboard.press('Backspace');
        await inputField.type(newValue);
    
        const inputValue = await inputField.inputValue();
        return inputValue;
    }

    async waitForBasketCountNonZero() {
        const selector = this.basketCountItems
        await this.page.waitForFunction(
          () => {
            const basketCountElement = document.querySelector('.basket-count-items');
            return basketCountElement && basketCountElement.innerText.trim() !== '0';
          },
          { polling: 'raf' }
        );
    }

    async waitForBasketCountZero() {
        const selector = this.basketCountItems
        await this.page.waitForFunction(
          () => {
            const basketCountElement = document.querySelector('.basket-count-items');
            return basketCountElement && basketCountElement.innerText.trim() === '0';
          },
          { polling: 'raf' }
        );
    }

    async waitForBasketCountNonOne() {
        await this.page.waitForFunction(
          () => {
            const basketCountElement = document.querySelector('.basket-count-items');
            return basketCountElement && basketCountElement.innerText.trim() !== '1';
          },
          { polling: 'raf' }
        );
    }

    async waitForBasketCountNine() {
        await this.page.waitForFunction(
          () => {
            const basketCountElement = document.querySelector('.basket-count-items');
            return basketCountElement && basketCountElement.innerText.trim() === '9';
          },
          { polling: 'raf' }
        );
    }

    async waitForBasketCountTen() {
        await this.page.waitForFunction(
          () => {
            const basketCountElement = document.querySelector('.basket-count-items');
            return basketCountElement && basketCountElement.innerText.trim() === '10';
          },
          { polling: 'raf' }
        );
    }

    async open() {
        await this.page.goto('https://enotes.pointschool.ru'); 
    }

    async getElementText(selector) {
        return await this.page.innerText(selector);
    }


    async waitSelector(selector) {
        return await this.page.waitForSelector(selector);
    }

    async waitURL(){
        await this.page.waitForURL('https://enotes.pointschool.ru/basket')
    }

    async waitForBasketIconVisible() {
        await this.page.waitForSelector(this.basketIcon, { visible: true });
    }

    async getElementClasses(selector) {
        const element = await this.page.$(selector);
        if (element) {
          return await this.page.evaluate(el => el.className, element);
        } else {
          throw new Error(`Element with selector ${selector} not found.`);
        }
    }

    async clickBasketIcon() {
        await this.page.click(this.basketIcon);
    }

    async clickgotoBasketBtn() {
        await this.page.click(this.gotoBasketBtn);
    }

    async clickEmptyBasketBtn(){
        await this.page.click(this.emptyBasketBtn);
    }

    async clickBasketBtn(){
        await this.page.click(this.basket);
    }

    async clickCheckBox(){
        await this.page.click(this.checkbox);
    }

    async clickProduct(productId) {
        const productSelector = `div.note-item[data-product="${productId}"] button.actionBuyProduct`;
        await this.page.waitForSelector(productSelector, { visible: true });
        await this.page.click(productSelector);
    }

    async clickInput(productId) {
        const productSelector = `div.note-item[data-product="${productId}"] .form-control`;
        await this.page.waitForSelector(productSelector, { visible: true });
        await this.page.click(productSelector);
    }

    hasItem(itemId, itemType) {
        const itemSelector = this.getItemSelector(itemId, itemType);
        const element = this.page.$(itemSelector);
        return element !== null;
    }
    
    async navigateToBasketPage() {
        await this.waitURL();
        const currentURL = await this.page.url();
        if (/\/basket$/.test(currentURL)) {
        } else {
          throw new Error('Failed to navigate to page');
        }
      }
    

}

module.exports = MainPage;