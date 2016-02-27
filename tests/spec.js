global.join = function(text) { return typeof text === 'string' ? text : text.join(''); };
global.ones = function() { return 1; };
global.zeros = function() { return 0; };
var $ = require('../index.js');


describe('Proquery: $', function() {
  beforeEach(function() {
    browser.get('index.html#/form');
  });

  it('Should return array by default unless 2nd parameter, useOriginal is true', function() {
    expect($('.menu').getTagName()).toEqual(['ul']);
    expect($('.menu', true).getTagName()).toEqual('ul');
  });
});

describe('Proquery functions: ', function() {
  beforeEach(function() {
    browser.get('index.html#/form');
  });

  it('Should not support .find, .contents over filtered elements', function() {
    var $filteredElements = $('#animals').find('ul').find('li').filter(function(elem) {
      return $(elem).text().then(function(text) {
        return text === 'big dog';
      });
    });
    expect($filteredElements.val).toBeDefined();
    expect($filteredElements.find).toBeUndefined();
    expect($filteredElements.contents).toBeUndefined();
  });

  it('Should not support .get, .first, .last, .find over selected elements', function() {
    var $getElements = $('#animals').find('ul').find('li').get(0);
    expect($getElements.contents).toBeDefined();
    expect($getElements.get).toBeUndefined();
    expect($getElements.first).toBeUndefined();
    expect($getElements.last).toBeUndefined();
    expect($getElements.find).toBeUndefined();
  });

  it('Should not support .contents over searched elements', function() {
    var $findElements = $('[ng-model="fruit"]').find('option');
    expect($findElements.find).toBeDefined();
    expect($findElements.contents).toBeUndefined();
  });

  it('Should only support .find over iframe content', function() {
    browser.get('http://localhost:9920/tests/testapp/index.html');
    var $iframeContents = $('iframe:eq(1)').contents();
    expect($iframeContents.find).toBeDefined();
    expect($iframeContents.contents).toBeUndefined();
  });
});

describe('Proquery frame', function() {
  beforeEach(function() {
    browser.get('http://localhost:9920/tests/testapp/index.html');
  });

  it('Should not switch back to Default Content for initial query', function() {
    expect($('iframe').length).toBe(2);
    browser.driver.switchTo().frame(0);
    expect($('iframe').length).toBe(0);
  });

  it('Should switch back to Default Content with .end', function() {
    var $el = $('iframe').contents().find('#checkboxes');
    expect($el.is(':present')).toBe((function() {
      $el.end();
      browser.driver.switchTo().frame(0);
      var ret = element(by.id('checkboxes')).isPresent();
      expect(ret).toBeTruthy();
      browser.driver.switchTo().defaultContent();
      return ret;
    })());
  });

  it('Should get iframes with :eq psuedo selector', function() {
    expect($('iframe:eq(0)').attr('class')).toEqual('frame1');
    expect($('iframe:eq(1)').attr('class')).toEqual('frame2');
  });

  it('Should select iframe by Id/Class with `iframe` prefix', function() {
    expect($('iframe#frame2').attr('class')).toEqual('frame2');
    expect($('iframe.frame1').attr('id')).toEqual('frame1');
  });

  it('Should support .contents with .find for iframes', function() {
    expect($('iframe:eq(1)').contents().find('div').end().length).toBe(21);
    expect($('iframe#frame2').contents().find('div').end().length).toBe(21);
    expect($('iframe.frame1').contents().find('div').end().length).toBe(21);
  });

  it('Should support .contents with .get for iframes', function() {
    expect($('iframe').get(1).contents().find('div').end().length).toBe(21);
  });

  it('Should support nested .find', function() {
    expect($('iframe:eq(1)').contents().find('body').find('div').end().length).toBe(21);
    expect($('iframe#frame2').contents().find('body').find('div').end().length).toBe(21);
    expect($('iframe.frame1').contents().find('body').find('div').end().length).toBe(21);
    expect($('iframe').get(1).contents().find('body').find('div').end().length).toBe(21);
    expect($('iframe').contents().find('body').find('div').end().length).toBe(21);
  });
});

describe('Proquery selectors: ', function() {
  beforeEach(function() {
    browser.get('index.html#/form');
  });

  it('Should support attribute selector', function() {
    expect($('[type="text"]').length).toEqual(element.all(by.css('[type="text"]')).count());
  });

  it('Should support element selector', function() {
    expect($('textarea').length).toEqual(element.all(by.css('textarea')).count());
  });
  
  it('Should support class selector', function() {
    expect($('.menu').length).toEqual(element.all(by.css('.menu')).count());
  });

  it('Should support ID selector', function() {
    expect($('#checkboxes').length).toEqual(element.all(by.id('checkboxes')).count());
  });
  
  it('Should support ngModel selector', function() {
    expect($('[ng-model="username"]').length).toEqual(element.all(by.model('username')).count());
  });
  
  it('Should support {{BINDING}} selector', function() {
    expect($('{{username}}').length).toEqual(element.all(by.binding('username')).count());
  });

  it('Should support ngRepeat selector', function() {
    browser.get('index.html#/repeater');
    expect($('[ng-repeat="baz in days"]').length).toBe(element.all(by.repeater('baz in days')).count());
    expect($('[ng-repeat="baz in days | filter:\'T\'"]').length).toBe(element.all(by.repeater('baz in days | filter:\'T\'')).count());
  });

  it('Should support ngOptions selector', function() {
    expect($('[ng-options="fruit for fruit in fruits"]').length).toEqual(element.all(by.options('fruit for fruit in fruits')).count());
  });

  it('Should support basic nested (with space only) selectors', function() {
    expect($('#animals ul .pet').length).toEqual(element.all(by.cssContainingText('#animals ul .pet')).count());
  });
  
  it('Should support :first and :last psuedo selectors', function() {
    expect($('[type="text"]:first').length).toEqual(element.all(by.css('[type="text"]')).first().isPresent().then(ones, zeros));
    expect($('[type="text"]:last').length).toEqual(element.all(by.css('[type="text"]')).last().isPresent().then(ones, zeros));
    expect($('#checkboxes:first').length).toEqual(element.all(by.id('checkboxes')).first().isPresent().then(ones, zeros));
    expect($('#checkboxes:last').length).toEqual(element.all(by.id('checkboxes')).last().isPresent().then(ones, zeros));
    expect($('[ng-model="username"]:first').length).toEqual(element.all(by.model('username')).first().isPresent().then(ones, zeros));
    expect($('[ng-model="username"]:last').length).toEqual(element.all(by.model('username')).last().isPresent().then(ones, zeros));
    expect($('{{username}}:first').length).toEqual(element.all(by.binding('username')).first().isPresent().then(ones, zeros));
    expect($('{{username}}:last').length).toEqual(element.all(by.binding('username')).last().isPresent().then(ones, zeros));
    browser.get('index.html#/repeater');
    expect($('[ng-repeat="baz in days"]:first').length).toEqual(element.all(by.repeater('baz in days')).first().isPresent().then(ones, zeros));
    expect($('[ng-repeat="baz in days"]:last').length).toEqual(element.all(by.repeater('baz in days')).last().isPresent().then(ones, zeros));
  });
  
  it('Should support :contains psuedo selector for anchor, button, and nested elements', function() {
    expect($('a:contains(repeater)').length).toEqual(element.all(by.partialLinkText('repeater')).count());
    expect($('a:contains(\'repeater\')').length).toEqual(element.all(by.partialLinkText('repeater')).count());
    expect($('a:contains("repeater")').length).toEqual(element.all(by.partialLinkText('repeater')).count());
    expect($('button:contains(text)').length).toEqual(element.all(by.partialButtonText('text')).count());
    expect($('button:contains(\'text\')').length).toEqual(element.all(by.partialButtonText('text')).count());
    expect($('button:contains("text")').length).toEqual(element.all(by.partialButtonText('text')).count());
    expect($('#animals ul .pet:contains(dog)').length).toEqual(element.all(by.cssContainingText('#animals ul .pet', 'dog')).count());
    expect($('#animals ul .pet:contains(\'dog\')').length).toEqual(element.all(by.cssContainingText('#animals ul .pet', 'dog')).count());
    expect($('#animals ul .pet:contains("dog")').length).toEqual(element.all(by.cssContainingText('#animals ul .pet', 'dog')).count());
  });

  it('Should support native :checked psuedo selectors with <option>', function() {
    expect($('[ng-model="fruit"]').find('option').length).toBe(4);
    expect($('[ng-model="fruit"]').find('option:checked').length).toBe(1);
  });

  it('Should find activeElement with :focus', function() {
    var text = 'FOCUS IS HERE..!';
    expect($(':focus').val()).not.toBe(text);
    $('[ng-model="username"]').val(text);
    expect($(':focus').val()).toBe(text);
  });
});

describe('Proquery manipulations: ', function() {
  beforeEach(function() {
    browser.get('index.html#/form');
  });

  it('Should get attribute value (of first element) using .attr', function() {
    expect($('[class="pet"]').attr('value')).toEqual(element.all(by.css('[class="pet"]')).first().getAttribute('value'));
    expect($('[class="pet"]:first').attr('value')).toEqual(element.all(by.css('[class="pet"]')).first().getAttribute('value'));
    expect($('[class="pet"]:last').attr('value')).toEqual(element.all(by.css('[class="pet"]')).last().getAttribute('value'));
    expect($('#checkboxes').attr('value')).toEqual(element.all(by.id('checkboxes')).first().getAttribute('value'));
    expect($('#checkboxes:first').attr('value')).toEqual(element.all(by.id('checkboxes')).first().getAttribute('value'));
    expect($('#checkboxes:last').attr('value')).toEqual(element.all(by.id('checkboxes')).last().getAttribute('value'));
    expect($('[ng-model="username"]').attr('value')).toEqual(element.all(by.model('username')).first().getAttribute('value'));
    expect($('[ng-model="username"]:first').attr('value')).toEqual(element.all(by.model('username')).first().getAttribute('value'));
    expect($('[ng-model="username"]:last').attr('value')).toEqual(element.all(by.model('username')).last().getAttribute('value'));
    expect($('{{username}}').attr('value')).toEqual(element.all(by.binding('username')).first().getAttribute('value'));
    expect($('{{username}}:first').attr('value')).toEqual(element.all(by.binding('username')).first().getAttribute('value'));
    expect($('{{username}}:last').attr('value')).toEqual(element.all(by.binding('username')).last().getAttribute('value'));
    browser.get('index.html#/repeater');
    expect($('[ng-repeat="baz in days"]').attr('value')).toEqual(element.all(by.repeater('baz in days')).first().getAttribute('value'));
    expect($('[ng-repeat="baz in days"]:first').attr('value')).toEqual(element.all(by.repeater('baz in days')).first().getAttribute('value'));
    expect($('[ng-repeat="baz in days"]:last').attr('value')).toEqual(element.all(by.repeater('baz in days')).last().getAttribute('value'));
  });

  it('Should get attribute value (of first element) using .val', function() {
    expect($('[class="pet"]').val()).toEqual(element.all(by.css('[class="pet"]')).first().getAttribute('value'));
    expect($('[class="pet"]:first').val()).toEqual(element.all(by.css('[class="pet"]')).first().getAttribute('value'));
    expect($('[class="pet"]:last').val()).toEqual(element.all(by.css('[class="pet"]')).last().getAttribute('value'));
    expect($('#checkboxes').val()).toEqual(element.all(by.id('checkboxes')).first().getAttribute('value'));
    expect($('#checkboxes:first').val()).toEqual(element.all(by.id('checkboxes')).first().getAttribute('value'));
    expect($('#checkboxes:last').val()).toEqual(element.all(by.id('checkboxes')).last().getAttribute('value'));
    expect($('[ng-model="username"]').val()).toEqual(element.all(by.model('username')).first().getAttribute('value'));
    expect($('[ng-model="username"]:first').val()).toEqual(element.all(by.model('username')).first().getAttribute('value'));
    expect($('[ng-model="username"]:last').val()).toEqual(element.all(by.model('username')).last().getAttribute('value'));
    expect($('{{username}}').val()).toEqual(element.all(by.binding('username')).first().getAttribute('value'));
    expect($('{{username}}:first').val()).toEqual(element.all(by.binding('username')).first().getAttribute('value'));
    expect($('{{username}}:last').val()).toEqual(element.all(by.binding('username')).last().getAttribute('value'));
    browser.get('index.html#/repeater');
    expect($('[ng-repeat="baz in days"]').val()).toEqual(element.all(by.repeater('baz in days')).first().getAttribute('value'));
    expect($('[ng-repeat="baz in days"]:first').val()).toEqual(element.all(by.repeater('baz in days')).first().getAttribute('value'));
    expect($('[ng-repeat="baz in days"]:last').val()).toEqual(element.all(by.repeater('baz in days')).last().getAttribute('value'));
  });
  
  it('Should clear user-editable elements using .val', function() {
    $('[type="text"]').val('');
    element.all(by.css('[type="text"]')).each(function(input) { expect(input.getAttribute('value')).toBe(''); });
  });
  
  it('Should update user-editable elements using .val', function() {
    $('[type="text"]').val('codef0rmer');
    element.all(by.css('[type="text"]')).each(function(input) { expect(input.getAttribute('value')).toBe('codef0rmer'); });
  });

  it('Should get innerText using .text', function() {
    expect($('[class="pet"]').text()).toEqual(element.all(by.css('[class="pet"]')).getText().then(join));
    expect($('[class="pet"]:first').text()).toEqual(element.all(by.css('[class="pet"]')).first().getText());
    expect($('[class="pet"]:last').text()).toEqual(element.all(by.css('[class="pet"]')).last().getText());
    expect($('#checkboxes').text()).toEqual(element.all(by.id('checkboxes')).getText().then(join));
    expect($('#checkboxes:first').text()).toEqual(element.all(by.id('checkboxes')).first().getText());
    expect($('#checkboxes:last').text()).toEqual(element.all(by.id('checkboxes')).last().getText());
    expect($('[ng-model="username"]').text()).toEqual(element.all(by.model('username')).getText().then(join));
    expect($('[ng-model="username"]:first').text()).toEqual(element.all(by.model('username')).first().getText().then(join));
    expect($('[ng-model="username"]:last').text()).toEqual(element.all(by.model('username')).last().getText().then(join));
    expect($('{{username}}').text()).toEqual(element.all(by.binding('username')).getText().then(join));
    expect($('{{username}}:first').text()).toEqual(element.all(by.binding('username')).first().getText());
    expect($('{{username}}:last').text()).toEqual(element.all(by.binding('username')).last().getText());
    browser.get('index.html#/repeater');
    expect($('[ng-repeat="baz in days"]').text()).toEqual(element.all(by.repeater('baz in days')).getText().then(join));
    expect($('[ng-repeat="baz in days"]:first').text()).toEqual(element.all(by.repeater('baz in days')).first().getText());
    expect($('[ng-repeat="baz in days"]:last').text()).toEqual(element.all(by.repeater('baz in days')).last().getText());
  });

  it('Should get innerHTML using .html', function() {
    expect($('[class="pet"]').html()).toEqual(element.all(by.css('[class="pet"]')).first().getInnerHtml());
    expect($('[class="pet"]:first').html()).toEqual(element.all(by.css('[class="pet"]')).first().getInnerHtml());
    expect($('[class="pet"]:last').html()).toEqual(element.all(by.css('[class="pet"]')).last().getInnerHtml());
    expect($('#checkboxes').html()).toEqual(element.all(by.id('checkboxes')).first().getInnerHtml());
    expect($('#checkboxes:first').html()).toEqual(element.all(by.id('checkboxes')).first().getInnerHtml());
    expect($('#checkboxes:last').html()).toEqual(element.all(by.id('checkboxes')).last().getInnerHtml());
    expect($('[ng-model="username"]').html()).toEqual(element.all(by.model('username')).first().getInnerHtml());
    expect($('[ng-model="username"]:first').html()).toEqual(element.all(by.model('username')).first().getInnerHtml());
    expect($('[ng-model="username"]:last').html()).toEqual(element.all(by.model('username')).last().getInnerHtml());
    expect($('{{username}}').html()).toEqual(element.all(by.binding('username')).first().getInnerHtml());
    expect($('{{username}}:first').html()).toEqual(element.all(by.binding('username')).first().getInnerHtml());
    expect($('{{username}}:last').html()).toEqual(element.all(by.binding('username')).last().getInnerHtml());
    browser.get('index.html#/repeater');
    expect($('[ng-repeat="baz in days"]').html()).toEqual(element.all(by.repeater('baz in days')).first().getInnerHtml());
    expect($('[ng-repeat="baz in days"]:first').html()).toEqual(element.all(by.repeater('baz in days')).first().getInnerHtml());
    expect($('[ng-repeat="baz in days"]:last').html()).toEqual(element.all(by.repeater('baz in days')).last().getInnerHtml());
  });
});

describe('Proquery traversing: ', function() {
  beforeEach(function() {
    browser.get('index.html#/form');
  });

  it('Should find children with supported selectors and psuedo selectors', function() {
    expect($('body').find('[class="pet"]').length).toBe(element.all(by.css('body')).all(by.css('[class="pet"]')).count());
    expect($('body').find('#checkboxes').length).toBe(element.all(by.css('body')).all(by.id('checkboxes')).count());
    expect($('body').find('[ng-model="username"]').length).toBe(element.all(by.css('body')).all(by.model('username')).count());
    expect($('body').find('{{username}}').length).toBe(element.all(by.css('body')).all(by.binding('username')).count());
    browser.get('index.html#/repeater');
    expect($('body').find('[ng-repeat="baz in days"]').length).toEqual(element.all(by.css('body')).all(by.repeater('baz in days')).count());
  });

  it('Should support .filter and .filterNative', function() {
    var li = $('#animals').find('ul').find('li').filterNative(function(elem) {
      return elem.getText().then(function(text) {
        return text === 'big dog';
      });
    });
    var $li = $('#animals').find('ul').find('li').filter(function(elem) {
      return $(elem).text().then(function(text) {
        return text === 'big dog';
      });
    });
    expect(li.count()).toBe($li.length);
  });

  it('Should support .get, .first, and .last', function() {
    expect($('[class="pet"]').get(0).val()).toBe(element.all(by.css('[class="pet"]')).get(0).getAttribute('value'));
    expect($('[class="pet"]').first().val()).toBe(element.all(by.css('[class="pet"]')).first().getAttribute('value'));
    expect($('[class="pet"]').last().val()).toBe(element.all(by.css('[class="pet"]')).last().getAttribute('value'));
    expect($('#checkboxes').get(0).val()).toBe(element.all(by.id('checkboxes')).get(0).getAttribute('value'));
    expect($('#checkboxes').first().val()).toBe(element.all(by.id('checkboxes')).first().getAttribute('value'));
    expect($('#checkboxes').last().val()).toBe(element.all(by.id('checkboxes')).last().getAttribute('value'));
    expect($('[ng-model="username"]').get(0).val()).toBe(element.all(by.model('username')).get(0).getAttribute('value'));
    expect($('[ng-model="username"]').first().val()).toBe(element.all(by.model('username')).first().getAttribute('value'));
    expect($('[ng-model="username"]').last().val()).toBe(element.all(by.model('username')).last().getAttribute('value'));
    expect($('{{username}}').get(0).val()).toBe(element.all(by.binding('username')).get(0).getAttribute('value'));
    expect($('{{username}}').first().val()).toBe(element.all(by.binding('username')).first().getAttribute('value'));
    expect($('{{username}}').last().val()).toBe(element.all(by.binding('username')).last().getAttribute('value'));
    browser.get('index.html#/repeater');
    expect($('[ng-repeat="baz in days"]').get(0).val()).toEqual(element.all(by.repeater('baz in days')).get(0).getAttribute('value'));
    expect($('[ng-repeat="baz in days"]').first().val()).toEqual(element.all(by.repeater('baz in days')).first().getAttribute('value'));
    expect($('[ng-repeat="baz in days"]').last().val()).toEqual(element.all(by.repeater('baz in days')).last().getAttribute('value'));
  });

  it('Should support :eq alternative to .get', function() {
    expect($('[class="pet"]:eq(0)').val()).toBe($('[class="pet"]').get(0).val());
    expect($('#checkboxes:eq(0)').val()).toBe($('#checkboxes').get(0).val());
    expect($('[ng-model="username"]:eq(0)').val()).toBe($('[ng-model="username"]').get(0).val());
    expect($('{{username}}:eq(0)').val()).toBe($('{{username}}').get(0).val());
    browser.get('index.html#/repeater');
    expect($('[ng-repeat="baz in days"]:eq(0)').val()).toBe($('[ng-repeat="baz in days"]').get(0).val());
  });

  it('Should fetch .row -> .column in ngRepeat', function() {
    browser.get('index.html#/repeater');
    expect(element(by.repeater('baz in days').row(0)).getText()).toBe('T');
    expect($('[ng-repeat="baz in days"]').get(0).text()).toEqual(element(by.repeater('baz in days').row(0)).getText());
    expect($('[ng-repeat="baz in days"]').get(0).find('baz.initial').get(0).text()).toEqual(element(by.repeater('baz in days').row(0).column('baz.initial')).getText());
  });

  it('Should fetch .column -> .row in ngRepeat', function() {
    browser.get('index.html#/repeater');
    expect($('[ng-repeat="baz in days"]').find('baz.initial').text()).toEqual(element.all(by.repeater('baz in days').column('baz.initial')).getText().then(join));
    expect($('[ng-repeat="baz in days"]').find('baz.initial').get(1).text()).toEqual(element(by.repeater('baz in days').column('baz.initial').row(1)).getText());
  });

  it('Should support .is for presence, visibility, and check status', function() {
    expect($('#checkboxes').is(':present')).toBe(element.all(by.id('checkboxes')).first().isPresent());
    expect($('#checkboxes:first').is(':present')).toBe(element(by.id('checkboxes')).isPresent());
    expect($('#checkboxes').is(':visible')).toBe(element.all(by.id('checkboxes')).first().isDisplayed());
    expect($('#checkboxes:first').is(':visible')).toBe(element(by.id('checkboxes')).isDisplayed());
    expect($('#checkboxes').is(':checked')).toBe(element.all(by.id('checkboxes')).first().isSelected());
    expect($('#checkboxes:first').is(':checked')).toBe(element(by.id('checkboxes')).isSelected());
  });

  it('Should support .eq to get webElement', function() {
    expect($('{{greeting}}').eq(0).getText()).toBe(element.all(by.binding('greeting')).filter(function(el, i) { return i === 0; }).first().getWebElement().getText());
    expect($('{{greeting}}:first').eq(0).getText()).toBe(element(by.binding('greeting')).getWebElement().getText());
    expect($('{{greeting}}').eq(-1)).toBeUndefined();
    expect($('{{greeting}}').eq()).toBeUndefined();
  });
  
  it('Should expose existing APIs with .find, .filter, .get, .first, and .last', function() {
    expect($('body').find('[type="text"]').length).toBeDefined();
    expect($('body').filter(function() { return true; }).length).toBeDefined();
    expect($('body').get(0).length).toBeDefined();
    expect($('body').first().length).toBeDefined();
    expect($('body').last().length).toBeDefined();
  });
});