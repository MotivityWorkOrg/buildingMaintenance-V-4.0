describe('Home', function () {

  beforeEach(function () {
    browser.get('/');
  });

  it('should have <my-home>', function () {
    let home = element(by.css('my-app my-home'));
    expect(home.isPresent()).toEqual(true);
    expect(home.getText()).toEqual("Home Works!");
  });

});
