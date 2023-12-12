class LoginPage {
  constructor(page) {
    this.page = page;
    this.username = '#loginform-username';
    this.password = '#loginform-password';
    this.submitBtn = '//button[@name="login-button"]'
  }

  async open() {
    await this.page.goto('https://enotes.pointschool.ru/login'); 
  }

  async fillLoginForm() {
    await this.page.type(this.username, 'test');
    await this.page.type(this.password, 'test');
  }

  async submitLoginForm() {
    await this.page.click(this.submitBtn);
  }

  async loginWithCredentials() {
    await this.open();
    await this.page.waitForLoadState();
    await this.fillLoginForm();
    await this.submitLoginForm();
  }
}

module.exports = LoginPage;


