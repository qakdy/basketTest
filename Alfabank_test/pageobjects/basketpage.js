class BasketPage {
    constructor(page) {
      this.page = page;
      this.header = 'h1'
    }
  
    async open() {
      await this.page.goto('https://enotes.pointschool.ru/basket'); 
    }

    async getHeaderText() {
        return await this.page.innerText(this.header);
    }

    
    
}
  
module.exports = BasketPage;
  
  
  