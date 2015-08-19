var $p = require('../index.js');
describe('angularjs homepage', function() {
  it('should greet the named user', function() {
    browser.get('tests/test.html');

    $p('[ng-model="yourName"]').val('Julie');
    expect($p('{{yourName}}').val()).toEqual('Hello Julie!');
  });
});
