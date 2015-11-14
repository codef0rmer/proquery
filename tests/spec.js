global.join = function(text) { return typeof text === 'string' ? text : text.join(''); };
global.ones = function() { return 1; };
global.zeros = function() { return 0; };
var $p = require('../index.js');

describe('Proquery frame', function() {
  beforeEach(function() {
    browser.get('http://localhost:9920/tests/testapp/index.html');
  });

  it('Should switch back to Default Content for initial query', function() {
    browser.driver.switchTo().frame(0);
    expect($p('iframe').length).toBe(2);
  });

  it('Should get iframes with :eq psuedo selector', function() {
    expect($p('iframe:eq(0)').attr('class')).toEqual('frame1');
    expect($p('iframe:eq(1)').attr('class')).toEqual('frame2');
  });

  it('Should select iframe by Id/Class with `iframe` prefix', function() {
    expect($p('iframe#frame2').attr('class')).toEqual('frame2');
    expect($p('iframe.frame1').attr('id')).toEqual('frame1');
  });

  it('Should support .contents with .find for iframes', function() {
    expect($p('iframe:eq(1)').contents().find('div').length).toBe(21);
    expect($p('iframe#frame2').contents().find('div').length).toBe(21);
    expect($p('iframe.frame1').contents().find('div').length).toBe(21);
  });

  it('Should support .contents with .get for iframes', function() {
    expect($p('iframe').get(1).contents().find('div').length).toBe(21);
  });

  it('Should support nested .find', function() {
    expect($p('iframe:eq(1)').contents().find('body').find('div').length).toBe(21);
    expect($p('iframe#frame2').contents().find('body').find('div').length).toBe(21);
    expect($p('iframe.frame1').contents().find('body').find('div').length).toBe(21);
    expect($p('iframe').get(1).contents().find('body').find('div').length).toBe(21);
    expect($p('iframe').contents().find('body').find('div').length).toBe(21);
  });
});

describe('Proquery selectors: ', function() {
  beforeEach(function() {
    browser.get('index.html#/form');
  });

  it('Should support attribute selector', function() {
    expect($p('[type="text"]').length).toEqual(element.all(by.css('[type="text"]')).count());
  });

  it('Should support element selector', function() {
    expect($p('textarea').length).toEqual(element.all(by.css('textarea')).count());
  });
  
  it('Should support class selector', function() {
    expect($p('.menu').length).toEqual(element.all(by.css('.menu')).count());
  });

  it('Should support ID selector', function() {
    expect($p('#checkboxes').length).toEqual(element.all(by.id('checkboxes')).count());
  });
  
  it('Should support ngModel selector', function() {
    expect($p('[ng-model="username"]').length).toEqual(element.all(by.model('username')).count());
  });
  
  it('Should support {{BINDING}} selector', function() {
    expect($p('{{username}}').length).toEqual(element.all(by.binding('username')).count());
  });

  it('Should support ngRepeat selector', function() {
    browser.get('index.html#/repeater');
    expect($p('[ng-repeat="baz in days"]').length).toBe(element.all(by.repeater('baz in days')).count());
    expect($p('[ng-repeat="baz in days | filter:\'T\'"]').length).toBe(element.all(by.repeater('baz in days | filter:\'T\'')).count());
  });

  it('Should support ngOptions selector', function() {
    expect($p('[ng-options="fruit for fruit in fruits"]').length).toEqual(element.all(by.options('fruit for fruit in fruits')).count());
  });

  it('Should support basic nested (with space only) selectors', function() {
    expect($p('#animals ul .pet').length).toEqual(element.all(by.cssContainingText('#animals ul .pet')).count());
  });
  
  it('Should support :first and :last psuedo selectors', function() {
    expect($p('[type="text"]:first').length).toEqual(element.all(by.css('[type="text"]')).first().isPresent().then(ones, zeros));
    expect($p('[type="text"]:last').length).toEqual(element.all(by.css('[type="text"]')).last().isPresent().then(ones, zeros));
    expect($p('#checkboxes:first').length).toEqual(element.all(by.id('checkboxes')).first().isPresent().then(ones, zeros));
    expect($p('#checkboxes:last').length).toEqual(element.all(by.id('checkboxes')).last().isPresent().then(ones, zeros));
    expect($p('[ng-model="username"]:first').length).toEqual(element.all(by.model('username')).first().isPresent().then(ones, zeros));
    expect($p('[ng-model="username"]:last').length).toEqual(element.all(by.model('username')).last().isPresent().then(ones, zeros));
    expect($p('{{username}}:first').length).toEqual(element.all(by.binding('username')).first().isPresent().then(ones, zeros));
    expect($p('{{username}}:last').length).toEqual(element.all(by.binding('username')).last().isPresent().then(ones, zeros));
    browser.get('index.html#/repeater');
    expect($p('[ng-repeat="baz in days"]:first').length).toEqual(element.all(by.repeater('baz in days')).first().isPresent().then(ones, zeros));
    expect($p('[ng-repeat="baz in days"]:last').length).toEqual(element.all(by.repeater('baz in days')).last().isPresent().then(ones, zeros));
  });
  
  it('Should support :contains psuedo selector for anchor, button, and nested elements', function() {
    expect($p('a:contains(repeater)').length).toEqual(element.all(by.partialLinkText('repeater')).count());
    expect($p('a:contains(\'repeater\')').length).toEqual(element.all(by.partialLinkText('repeater')).count());
    expect($p('a:contains("repeater")').length).toEqual(element.all(by.partialLinkText('repeater')).count());
    expect($p('button:contains(text)').length).toEqual(element.all(by.partialButtonText('text')).count());
    expect($p('button:contains(\'text\')').length).toEqual(element.all(by.partialButtonText('text')).count());
    expect($p('button:contains("text")').length).toEqual(element.all(by.partialButtonText('text')).count());
    expect($p('#animals ul .pet:contains(dog)').length).toEqual(element.all(by.cssContainingText('#animals ul .pet', 'dog')).count());
    expect($p('#animals ul .pet:contains(\'dog\')').length).toEqual(element.all(by.cssContainingText('#animals ul .pet', 'dog')).count());
    expect($p('#animals ul .pet:contains("dog")').length).toEqual(element.all(by.cssContainingText('#animals ul .pet', 'dog')).count());
  });

  it('Should support native :checked psuedo selectors with <option>', function() {
    expect($p('[ng-model="fruit"]').find('option').length).toBe(4);
    expect($p('[ng-model="fruit"]').find('option:checked').length).toBe(1);
  });

  it('Should find activeElement with :focus', function() {
    var text = 'FOCUS IS HERE..!';
    expect($p(':focus').val()).not.toBe(text);
    $p('[ng-model="username"]').val(text);
    expect($p(':focus').val()).toBe(text);
  });
});

describe('Proquery manipulations: ', function() {
  beforeEach(function() {
    browser.get('index.html#/form');
  });

  it('Should get attribute value (of first element) using .attr', function() {
    expect($p('[class="pet"]').attr('value')).toEqual(element.all(by.css('[class="pet"]')).first().getAttribute('value'));
    expect($p('[class="pet"]:first').attr('value')).toEqual(element.all(by.css('[class="pet"]')).first().getAttribute('value'));
    expect($p('[class="pet"]:last').attr('value')).toEqual(element.all(by.css('[class="pet"]')).last().getAttribute('value'));
    expect($p('#checkboxes').attr('value')).toEqual(element.all(by.id('checkboxes')).first().getAttribute('value'));
    expect($p('#checkboxes:first').attr('value')).toEqual(element.all(by.id('checkboxes')).first().getAttribute('value'));
    expect($p('#checkboxes:last').attr('value')).toEqual(element.all(by.id('checkboxes')).last().getAttribute('value'));
    expect($p('[ng-model="username"]').attr('value')).toEqual(element.all(by.model('username')).first().getAttribute('value'));
    expect($p('[ng-model="username"]:first').attr('value')).toEqual(element.all(by.model('username')).first().getAttribute('value'));
    expect($p('[ng-model="username"]:last').attr('value')).toEqual(element.all(by.model('username')).last().getAttribute('value'));
    expect($p('{{username}}').attr('value')).toEqual(element.all(by.binding('username')).first().getAttribute('value'));
    expect($p('{{username}}:first').attr('value')).toEqual(element.all(by.binding('username')).first().getAttribute('value'));
    expect($p('{{username}}:last').attr('value')).toEqual(element.all(by.binding('username')).last().getAttribute('value'));
    browser.get('index.html#/repeater');
    expect($p('[ng-repeat="baz in days"]').attr('value')).toEqual(element.all(by.repeater('baz in days')).first().getAttribute('value'));
    expect($p('[ng-repeat="baz in days"]:first').attr('value')).toEqual(element.all(by.repeater('baz in days')).first().getAttribute('value'));
    expect($p('[ng-repeat="baz in days"]:last').attr('value')).toEqual(element.all(by.repeater('baz in days')).last().getAttribute('value'));
  });

  it('Should get attribute value (of first element) using .val', function() {
    expect($p('[class="pet"]').val()).toEqual(element.all(by.css('[class="pet"]')).first().getAttribute('value'));
    expect($p('[class="pet"]:first').val()).toEqual(element.all(by.css('[class="pet"]')).first().getAttribute('value'));
    expect($p('[class="pet"]:last').val()).toEqual(element.all(by.css('[class="pet"]')).last().getAttribute('value'));
    expect($p('#checkboxes').val()).toEqual(element.all(by.id('checkboxes')).first().getAttribute('value'));
    expect($p('#checkboxes:first').val()).toEqual(element.all(by.id('checkboxes')).first().getAttribute('value'));
    expect($p('#checkboxes:last').val()).toEqual(element.all(by.id('checkboxes')).last().getAttribute('value'));
    expect($p('[ng-model="username"]').val()).toEqual(element.all(by.model('username')).first().getAttribute('value'));
    expect($p('[ng-model="username"]:first').val()).toEqual(element.all(by.model('username')).first().getAttribute('value'));
    expect($p('[ng-model="username"]:last').val()).toEqual(element.all(by.model('username')).last().getAttribute('value'));
    expect($p('{{username}}').val()).toEqual(element.all(by.binding('username')).first().getAttribute('value'));
    expect($p('{{username}}:first').val()).toEqual(element.all(by.binding('username')).first().getAttribute('value'));
    expect($p('{{username}}:last').val()).toEqual(element.all(by.binding('username')).last().getAttribute('value'));
    browser.get('index.html#/repeater');
    expect($p('[ng-repeat="baz in days"]').val()).toEqual(element.all(by.repeater('baz in days')).first().getAttribute('value'));
    expect($p('[ng-repeat="baz in days"]:first').val()).toEqual(element.all(by.repeater('baz in days')).first().getAttribute('value'));
    expect($p('[ng-repeat="baz in days"]:last').val()).toEqual(element.all(by.repeater('baz in days')).last().getAttribute('value'));
  });
  
  it('Should clear user-editable elements using .val', function() {
    $p('[type="text"]').val('');
    element.all(by.css('[type="text"]')).each(function(input) { expect(input.getAttribute('value')).toBe(''); });
  });
  
  it('Should update user-editable elements using .val', function() {
    $p('[type="text"]').val('codef0rmer');
    element.all(by.css('[type="text"]')).each(function(input) { expect(input.getAttribute('value')).toBe('codef0rmer'); });
  });

  it('Should throw error for non-user-editable elements using .val', function() {
    $p('[class="pet"]').val('').thenCatch(function(err) { expect(err).toBeDefined(); });
  });

  it('Should get innerText using .text', function() {
    expect($p('[class="pet"]').text()).toEqual(element.all(by.css('[class="pet"]')).getText().then(join));
    expect($p('[class="pet"]:first').text()).toEqual(element.all(by.css('[class="pet"]')).first().getText());
    expect($p('[class="pet"]:last').text()).toEqual(element.all(by.css('[class="pet"]')).last().getText());
    expect($p('#checkboxes').text()).toEqual(element.all(by.id('checkboxes')).getText().then(join));
    expect($p('#checkboxes:first').text()).toEqual(element.all(by.id('checkboxes')).first().getText());
    expect($p('#checkboxes:last').text()).toEqual(element.all(by.id('checkboxes')).last().getText());
    expect($p('[ng-model="username"]').text()).toEqual(element.all(by.model('username')).getText().then(join));
    expect($p('[ng-model="username"]:first').text()).toEqual(element.all(by.model('username')).first().getText().then(join));
    expect($p('[ng-model="username"]:last').text()).toEqual(element.all(by.model('username')).last().getText().then(join));
    expect($p('{{username}}').text()).toEqual(element.all(by.binding('username')).getText().then(join));
    expect($p('{{username}}:first').text()).toEqual(element.all(by.binding('username')).first().getText());
    expect($p('{{username}}:last').text()).toEqual(element.all(by.binding('username')).last().getText());
    browser.get('index.html#/repeater');
    expect($p('[ng-repeat="baz in days"]').text()).toEqual(element.all(by.repeater('baz in days')).getText().then(join));
    expect($p('[ng-repeat="baz in days"]:first').text()).toEqual(element.all(by.repeater('baz in days')).first().getText());
    expect($p('[ng-repeat="baz in days"]:last').text()).toEqual(element.all(by.repeater('baz in days')).last().getText());
  });

  it('Should get innerHTML using .html', function() {
    expect($p('[class="pet"]').html()).toEqual(element.all(by.css('[class="pet"]')).first().getInnerHtml());
    expect($p('[class="pet"]:first').html()).toEqual(element.all(by.css('[class="pet"]')).first().getInnerHtml());
    expect($p('[class="pet"]:last').html()).toEqual(element.all(by.css('[class="pet"]')).last().getInnerHtml());
    expect($p('#checkboxes').html()).toEqual(element.all(by.id('checkboxes')).first().getInnerHtml());
    expect($p('#checkboxes:first').html()).toEqual(element.all(by.id('checkboxes')).first().getInnerHtml());
    expect($p('#checkboxes:last').html()).toEqual(element.all(by.id('checkboxes')).last().getInnerHtml());
    expect($p('[ng-model="username"]').html()).toEqual(element.all(by.model('username')).first().getInnerHtml());
    expect($p('[ng-model="username"]:first').html()).toEqual(element.all(by.model('username')).first().getInnerHtml());
    expect($p('[ng-model="username"]:last').html()).toEqual(element.all(by.model('username')).last().getInnerHtml());
    expect($p('{{username}}').html()).toEqual(element.all(by.binding('username')).first().getInnerHtml());
    expect($p('{{username}}:first').html()).toEqual(element.all(by.binding('username')).first().getInnerHtml());
    expect($p('{{username}}:last').html()).toEqual(element.all(by.binding('username')).last().getInnerHtml());
    browser.get('index.html#/repeater');
    expect($p('[ng-repeat="baz in days"]').html()).toEqual(element.all(by.repeater('baz in days')).first().getInnerHtml());
    expect($p('[ng-repeat="baz in days"]:first').html()).toEqual(element.all(by.repeater('baz in days')).first().getInnerHtml());
    expect($p('[ng-repeat="baz in days"]:last').html()).toEqual(element.all(by.repeater('baz in days')).last().getInnerHtml());
  });
});

describe('Proquery traversing: ', function() {
  beforeEach(function() {
    browser.get('index.html#/form');
  });

  it('Should find children with supported selectors and psuedo selectors', function() {
    expect($p('body').find('[class="pet"]').length).toBe(element.all(by.css('body')).all(by.css('[class="pet"]')).count());
    expect($p('body').find('#checkboxes').length).toBe(element.all(by.css('body')).all(by.id('checkboxes')).count());
    expect($p('body').find('[ng-model="username"]').length).toBe(element.all(by.css('body')).all(by.model('username')).count());
    expect($p('body').find('{{username}}').length).toBe(element.all(by.css('body')).all(by.binding('username')).count());
    browser.get('index.html#/repeater');
    expect($p('body').find('[ng-repeat="baz in days"]').length).toEqual(element.all(by.css('body')).all(by.repeater('baz in days')).count());
  });

  it('Should support .filter and .filterNative', function() {
    var li = $p('#animals').find('ul').find('li').filterNative(function(elem) {
      return elem.getText().then(function(text) {
        return text === 'big dog';
      });
    });
    var $li = $p('#animals').find('ul').find('li').filter(function(elem) {
      return $p(elem).text().then(function(text) {
        return text === 'big dog';
      });
    });
    expect(li.count()).toBe($li.length);
  });

  it('Should support .get, .first, and .last', function() {
    expect($p('[class="pet"]').get(0).val()).toBe(element.all(by.css('[class="pet"]')).get(0).getAttribute('value'));
    expect($p('[class="pet"]').first().val()).toBe(element.all(by.css('[class="pet"]')).first().getAttribute('value'));
    expect($p('[class="pet"]').last().val()).toBe(element.all(by.css('[class="pet"]')).last().getAttribute('value'));
    expect($p('#checkboxes').get(0).val()).toBe(element.all(by.id('checkboxes')).get(0).getAttribute('value'));
    expect($p('#checkboxes').first().val()).toBe(element.all(by.id('checkboxes')).first().getAttribute('value'));
    expect($p('#checkboxes').last().val()).toBe(element.all(by.id('checkboxes')).last().getAttribute('value'));
    expect($p('[ng-model="username"]').get(0).val()).toBe(element.all(by.model('username')).get(0).getAttribute('value'));
    expect($p('[ng-model="username"]').first().val()).toBe(element.all(by.model('username')).first().getAttribute('value'));
    expect($p('[ng-model="username"]').last().val()).toBe(element.all(by.model('username')).last().getAttribute('value'));
    expect($p('{{username}}').get(0).val()).toBe(element.all(by.binding('username')).get(0).getAttribute('value'));
    expect($p('{{username}}').first().val()).toBe(element.all(by.binding('username')).first().getAttribute('value'));
    expect($p('{{username}}').last().val()).toBe(element.all(by.binding('username')).last().getAttribute('value'));
    browser.get('index.html#/repeater');
    expect($p('[ng-repeat="baz in days"]').get(0).val()).toEqual(element.all(by.repeater('baz in days')).get(0).getAttribute('value'));
    expect($p('[ng-repeat="baz in days"]').first().val()).toEqual(element.all(by.repeater('baz in days')).first().getAttribute('value'));
    expect($p('[ng-repeat="baz in days"]').last().val()).toEqual(element.all(by.repeater('baz in days')).last().getAttribute('value'));
  });

  it('Should support :eq alternative to .get', function() {
    expect($p('[class="pet"]:eq(0)').val()).toBe($p('[class="pet"]').get(0).val());
    expect($p('#checkboxes:eq(0)').val()).toBe($p('#checkboxes').get(0).val());
    expect($p('[ng-model="username"]:eq(0)').val()).toBe($p('[ng-model="username"]').get(0).val());
    expect($p('{{username}}:eq(0)').val()).toBe($p('{{username}}').get(0).val());
    browser.get('index.html#/repeater');
    expect($p('[ng-repeat="baz in days"]:eq(0)').val()).toBe($p('[ng-repeat="baz in days"]').get(0).val());
  });

  it('Should fetch .row -> .column in ngRepeat', function() {
    browser.get('index.html#/repeater');
    expect($p('[ng-repeat="baz in days"]').get(0).text()).toEqual(element(by.repeater('baz in days').row(0)).getText());
    expect($p('[ng-repeat="baz in days"]').get(0).find('baz.initial').text()).toEqual(element(by.repeater('baz in days').row(0).column('baz.initial')).getText());
  });

  it('Should fetch .column -> .row in ngRepeat', function() {
    browser.get('index.html#/repeater');
    expect($p('[ng-repeat="baz in days"]').find('baz.initial').text()).toEqual(element.all(by.repeater('baz in days').column('baz.initial')).getText().then(join));
    expect($p('[ng-repeat="baz in days"]').find('baz.initial').get(1).text()).toEqual(element.all(by.repeater('baz in days').column('baz.initial').row(1)).getText().then(join));
  });

  it('Should support .is for presence, visibility, and check status', function() {
    expect($p('#checkboxes').is(':present')).toBe(element.all(by.id('checkboxes')).first().isPresent());
    expect($p('#checkboxes:first').is(':present')).toBe(element(by.id('checkboxes')).isPresent());
    expect($p('#checkboxes').is(':visible')).toBe(element.all(by.id('checkboxes')).first().isDisplayed());
    expect($p('#checkboxes:first').is(':visible')).toBe(element(by.id('checkboxes')).isDisplayed());
    expect($p('#checkboxes').is(':checked')).toBe(element.all(by.id('checkboxes')).first().isSelected());
    expect($p('#checkboxes:first').is(':checked')).toBe(element(by.id('checkboxes')).isSelected());
  });

  it('Should support .eq to get webElement', function() {
    expect($p('{{greeting}}').eq(0).getText()).toBe(element.all(by.binding('greeting')).filter(function(el, i) { return i === 0; }).first().getWebElement().getText());
    expect($p('{{greeting}}:first').eq(0).getText()).toBe(element(by.binding('greeting')).getWebElement().getText());
    expect($p('{{greeting}}').eq(-1)).toBeUndefined();
    expect($p('{{greeting}}').eq()).toBeUndefined();
  });
  
  it('Should expose existing APIs with .find, .filter, .get, .first, and .last', function() {
    expect($p('body').find('[type="text"]').length).toBeDefined();
    expect($p('body').filter(function() { return true; }).length).toBeDefined();
    expect($p('body').get(0).length).toBeDefined();
    expect($p('body').first().length).toBeDefined();
    expect($p('body').last().length).toBeDefined();
  });
});