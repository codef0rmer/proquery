var $p = require('../index.js');

describe('Proquery selectors: ', function() {
  beforeEach(function() {
    browser.get('index.html#/form');
  });

  it('Should support ATTR selector', function() {
    expect($p('[type="text"]').length).toEqual(element.all(by.css('[type="text"]')).count());
    expect($p('[name="points"]').length).toEqual(element.all(by.css('[name="points"]')).count());
  });

  it('Should support ngModel selector', function() {
    expect($p('[ng-model="username"]').length).toEqual(element.all(by.model('username')).count());
  });

  it('Should support ELEMENT and CLASS selector', function() {
    expect($p('body').length).toEqual(element.all(by.css('body')).count());
    expect($p('.menu').length).toEqual(element.all(by.css('menu')).count());
  });

  it('Should support ID selector', function() {
    expect($p('#checkboxes').length).toEqual(element.all(by.id('checkboxes')).count());
  });

  it('Should support {{BINDING}} selector', function() {
    expect($p('{{username}}').length).toEqual(element.all(by.binding('username')).count());
  });

  it('Should support psuedo selectors, :first and :last', function() {
    expect($p('[type="text"]:first').length).toEqual(element.all(by.css('[type="text"]')).first().isPresent().then(function() { return 1; }, function() { return 0; }));
    expect($p('[type="text"]:last').length).toEqual(element.all(by.css('[type="text"]')).last().isPresent().then(function() { return 1; }, function() { return 0; }));
    expect($p('[name="points"]:first').length).toEqual(element.all(by.css('[name="points"]')).first().isPresent().then(function() { return 1; }, function() { return 0; }));
    expect($p('[name="points"]:last').length).toEqual(element.all(by.css('[name="points"]')).last().isPresent().then(function() { return 1; }, function() { return 0; }));
    expect($p('[ng-model="username"]:first').length).toEqual(element.all(by.model('username')).first().isPresent().then(function() { return 1; }, function() { return 0; }));
    expect($p('[ng-model="username"]:last').length).toEqual(element.all(by.model('username')).last().isPresent().then(function() { return 1; }, function() { return 0; }));
    expect($p('.body:first').length).toEqual(element.all(by.css('body')).first().isPresent().then(function() { return 1; }, function() { return 0; }));
    expect($p('.body:last').length).toEqual(element.all(by.css('body')).last().isPresent().then(function() { return 1; }, function() { return 0; }));
    expect($p('#checkboxes:first').length).toEqual(element.all(by.id('checkboxes')).first().isPresent().then(function() { return 1; }, function() { return 0; }));
    expect($p('#checkboxes:last').length).toEqual(element.all(by.id('checkboxes')).last().isPresent().then(function() { return 1; }, function() { return 0; }));
    expect($p('{{username}}:first').length).toEqual(element.all(by.binding('username')).first().isPresent().then(function() { return 1; }, function() { return 0; }));
    expect($p('{{username}}:last').length).toEqual(element.all(by.binding('username')).last().isPresent().then(function() { return 1; }, function() { return 0; }));
  });

  it('Should support :contains for anchor and button elements', function() {
    expect($p('a:contains(repeater)').length).toEqual(element.all(by.partialLinkText('repeater')).count());
    expect($p('a:contains(\'repeater\')').length).toEqual(element.all(by.partialLinkText('repeater')).count());
    expect($p('a:contains("repeater")').length).toEqual(element.all(by.partialLinkText('repeater')).count());
    expect($p('button:contains(text)').length).toEqual(element.all(by.partialButtonText('text')).count());
    expect($p('button:contains(\'text\')').length).toEqual(element.all(by.partialButtonText('text')).count());
    expect($p('button:contains("text")').length).toEqual(element.all(by.partialButtonText('text')).count());
  });
});

describe('Proquery manipulations: ', function() {
  beforeEach(function() {
    browser.get('index.html#/form');
  });

  it('Should get attribute value from first element using .attr', function() {
    expect($p('[name="points"]').attr('value')).toEqual(element.all(by.name('points')).first().getAttribute('value'));
    expect($p('[name="points"]:first').attr('value')).toEqual(element.all(by.name('points')).first().getAttribute('value'));
    expect($p('[name="points"]:last').attr('value')).toEqual(element.all(by.name('points')).last().getAttribute('value'));
  });

  it('Should get value from first element using .val', function() {
    expect($p('[type="text"]').val()).toEqual(element.all(by.css('[type="text"]')).first().getAttribute('value'));
    expect($p('[type="text"]:first').val()).toEqual(element.all(by.css('[type="text"]')).first().getAttribute('value'));
  });

  it('Should clear/update multiple elements using .val', function() {
    element.all(by.css('[type="text"]')).each(function(input) {
      expect(input.getAttribute('value')).not.toBe('');
    });
    $p('[type="text"]').val('');
    element.all(by.css('[type="text"]')).each(function(input) {
      expect(input.getAttribute('value')).toBe('');
    });
    
    element.all(by.css('[type="text"]')).each(function(input) {
      expect(input.getAttribute('value')).not.toBe('codef0rmer');
    });
    $p('[type="text"]').val('codef0rmer');
    element.all(by.css('[type="text"]')).each(function(input) {
      expect(input.getAttribute('value')).toBe('codef0rmer');
    });
  });

  it('Should get innerText using .text', function() {
    var join = function(text) { return typeof text === 'string' ? text : text.join(''); };
    expect($p('[type="text"]').text()).toEqual(element.all(by.css('[type="text"]')).getText().then(join));
    expect($p('[type="text"]:first').text()).toEqual(element.all(by.css('[type="text"]')).first().getText().then(join));
    expect($p('[name="points"]').text()).toEqual(element.all(by.css('[name="points"]')).getText().then(join));
    expect($p('[name="points"]:first').text()).toEqual(element.all(by.css('[name="points"]')).first().getText().then(join));
    expect($p('[ng-model="username"]').text()).toEqual(element.all(by.model('username')).getText().then(join));
    expect($p('[ng-model="username"]:first').text()).toEqual(element.all(by.model('username')).first().getText().then(join));
    expect($p('.body').text()).toEqual(element.all(by.css('body')).getText().then(join));
    expect($p('.body:first').text()).toEqual(element.all(by.css('body')).first().getText().then(join));
    expect($p('#checkboxes').text()).toEqual(element.all(by.id('checkboxes')).getText().then(join));
    expect($p('#checkboxes:first').text()).toEqual(element.all(by.id('checkboxes')).first().getText().then(join));
    expect($p('{{username}}').text()).toEqual(element.all(by.binding('username')).getText().then(join));
    expect($p('{{username}}:first').text()).toEqual(element.all(by.binding('username')).first().getText().then(join));
  });

  it('Should get innerHTML using .html', function() {
    expect($p('.body').html()).toEqual(element.all(by.css('body')).first().getInnerHtml());
    expect($p('.body:first').html()).toEqual(element.all(by.css('body')).first().getInnerHtml());
    expect($p('{{username}}').html()).toEqual(element.all(by.binding('username')).first().getInnerHtml());
    expect($p('{{username}}:first').html()).toEqual(element.all(by.binding('username')).first().getInnerHtml());
  });
});

describe('Proquery traversing: ', function() {
  beforeEach(function() {
    browser.get('index.html#/form');
  });

  it('Should find children with supported selectors and psuedo selectors', function() {
    expect($p('body').find('[type="text"]').length).toBe(element.all(by.css('body')).all(by.css('[type="text"]')).count());
    expect($p('body').find('[name="points"]').length).toBe(element.all(by.css('body')).all(by.css('[name="points"]')).count());
    expect($p('body').find('[ng-model="username"]').length).toBe(element.all(by.css('body')).all(by.model('username')).count());
    expect($p('body').find('.menu').length).toBe(element.all(by.css('body')).all(by.css('menu')).count());
    expect($p('body').find('#checkboxes').length).toBe(element.all(by.css('body')).all(by.id('checkboxes')).count());
    expect($p('body').find('{{username}}').length).toBe(element.all(by.css('body')).all(by.binding('username')).count());
    expect($p('body').find('{{username}}:first').length).toBe(element.all(by.css('body')).all(by.binding('username')).first().isPresent().then(function() { return 1; }, function() { return 0; }));
  });

  it('Should expose existing APIs with .find, .filter, .get, .first, and .last', function() {
    expect($p('body').find('[type="text"]').length).toBeDefined();
    expect($p('body').filter(function() { return true; }).length).toBeDefined();
    expect($p('body').get(0).length).toBeDefined();
    expect($p('body').first().length).toBeDefined();
    expect($p('body').last().length).toBeDefined();
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
    expect($p('[type="text"]').get(1).val()).toEqual(element.all(by.css('[type="text"]')).get(1).getAttribute('value'));
    expect($p('[type="text"]').first().val()).toEqual(element.all(by.css('[type="text"]')).first().getAttribute('value'));
    expect($p('[type="text"]').last().val()).toEqual(element.all(by.css('[type="text"]')).last().getAttribute('value'));
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
});