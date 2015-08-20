var $p = require('../index.js');
describe('angularjs homepage', function() {
  browser.get('tests/test.html');
  
  it('Should set/get value using attribute selector', function() {
    $p('[ng-model="yourName"]').val('Julie');
    expect($p('[ng-model="yourName"]').val()).toEqual('Julie');
  });

  it('Should set/get value using binding selector', function() {
    expect($p('{{yourName}}').val()).toEqual('Hello Julie!');
  });
});
