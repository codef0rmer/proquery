var $p = require('../../../index.js');

describe('ElementFinder', function() {
  beforeEach(function() {
    // Clear everything between each test.
    browser.driver.get('about:blank');
  });

  it('should return the same result as browser.findElement', function() {
    browser.get('index.html#/form');
    // var nameByElement = element(by.binding('username'));
    var nameByElement = $p('{{username}}');

    // expect(nameByElement.getText()).toEqual(browser.findElement(by.binding('username')).getText());
    expect(nameByElement.text()).toEqual(browser.findElement(by.binding('username')).getText());
  });

  it('should wait to grab the WebElement until a method is called', function() {
    // These should throw no error before a page is loaded.
    // var usernameInput = element.all(by.model('username'));
    var usernameInput = $p('[ng-model="username"]');
    // var name = element(by.binding('username'));
    var name = $p('{{username}}');

    browser.get('index.html#/form');

    // expect(name.getText()).toEqual('Anon');
    expect(name.text()).toEqual('Anon');

    // usernameInput.clear();
    usernameInput.val('');
    // usernameInput.sendKeys('Jane');
    usernameInput.val('Jane');
    // expect(name.getText()).toEqual('Jane');
    expect(name.text()).toEqual('Jane');
  });

  it('should chain element actions', function() {
    browser.get('index.html#/form');

    // var usernameInput = element(by.model('username'));
    var usernameInput = $p('[ng-model="username"]');
    // var name = element(by.binding('username'));
    var name = $p('{{username}}');

    // expect(name.getText()).toEqual('Anon');
    expect(name.text()).toEqual('Anon');

    // usernameInput.clear().sendKeys('Jane');
    usernameInput.val('Jane');
    // expect(name.getText()).toEqual('Jane');
    expect(name.text()).toEqual('Jane');
  });

  it('chained call should wait to grab the WebElement until a method is called', function() {
    // These should throw no error before a page is loaded.
    // var reused = element(by.id('baz')).element(by.binding('item.reusedBinding'));
    var reused = $p('#baz:first').find('{{item.reusedBinding}}:first');
    browser.get('index.html#/conflict');

    // expect(reused.getText()).toEqual('Inner: inner');
    expect(reused.text()).toEqual('Inner: inner');
    // expect(reused.isPresent()).toBe(true);
    expect(reused.is(':present')).toBe(true);
  });

  it('should differentiate elements with the same binding by chaining', function() {
    browser.get('index.html#/conflict');

    // var outerReused = element(by.binding('item.reusedBinding'));
    var outerReused = $p('{{item.reusedBinding}}:first');
    // var innerReused = element(by.id('baz')).element(by.binding('item.reusedBinding'));
    var innerReused = $p('#baz:first').find('{{item.reusedBinding}}:first');

    // expect(outerReused.getText()).toEqual('Outer: outer');
    expect(outerReused.text()).toEqual('Outer: outer');
    // expect(innerReused.getText()).toEqual('Inner: inner');
    expect(innerReused.text()).toEqual('Inner: inner');
  });

  it('should chain deeper than 2', function() {
    // These should throw no error before a page is loaded.
    // var reused = element(by.css('body')).element(by.id('baz')).element(by.binding('item.reusedBinding'));
    var reused = $p('body:first').find('#baz:first').find('{{item.reusedBinding}}:first');

    browser.get('index.html#/conflict');

    // expect(reused.getText()).toEqual('Inner: inner');
    expect(reused.text()).toEqual('Inner: inner');
  });

  it('should determine element presence properly with chaining', function() {
    browser.get('index.html#/conflict');
    expect(
      element(by.id('baz')).isElementPresent(by.binding('item.reusedBinding'))
    ).toEqual(
      $p('#baz:first').find('{{item.reusedBinding}}:first').is(':present')
    );

    expect(
      element(by.id('baz')).isElementPresent(by.binding('nopenopenope'))
    ).toEqual(
      $p('#baz:first').find('{{nopenopenope}}:first').is(':present')
    );

    expect(
      element(by.binding('nopenopenope')).isPresent()
    ).toEqual(
      $p('{{nopenopenope}}:first').is(':present')
    );
  });

  it('should export an isPresent helper', function() {
    browser.get('index.html#/form');

    expect(
      element(by.binding('greet')).isPresent()
    ).toBe(
      $p('{{greet}}:first').is(':present')
    );
    expect(
      element(by.binding('nopenopenope')).isPresent()
    ).toBe(
      $p('{{nopenopenope}}:first').is(':present')
    );
  });

  it('should allow handling errors', function() {
    browser.get('index.html#/form');
    var elmFinder = $('.nopenopenope').getText().then(function(success) {
      // This should throw an error. Fail.
      expect(true).toEqual(false);
    }, function(err) {
      expect(true).toEqual(true);
    });
    var $elmFinder = $p('.nopenopenope:first').text().then(function(success) {
      // This should throw an error. Fail.
      expect(true).toEqual(false);
    }, function(err) {
      expect(true).toEqual(true);
    });
    expect(elmFinder).toEqual($elmFinder);
  });

  it('should allow handling chained errors', function() {
    browser.get('index.html#/form');
    var elmFinder = $('.nopenopenope').$('furthernope').getText().then(
      function(success) {
        // This should throw an error. Fail.
        expect(true).toEqual(false);
      }, function(err) {
        expect(true).toEqual(true);
      });
    var $elmFinder = $p('.nopenopenope:first').find('furthernope:first').text().then(
      function(success) {
        // This should throw an error. Fail.
        expect(true).toEqual(false);
      }, function(err) {
        expect(true).toEqual(true);
      });
    expect(elmFinder).toEqual($elmFinder);
  });

  it('isPresent() should not raise error on chained finders', function() {
    browser.get('index.html#/form');
    var elmFinder = $('.nopenopenope').element(by.binding('greet'));
    var $elmFinder = $p('.nopenopenope:first').find('{{greet}}:first');

    expect(elmFinder.isPresent()).toBe(false);
    expect($elmFinder.is(':present')).toBe(false);
  });

  it('should export an allowAnimations helper', function() {
    browser.get('index.html#/animation');
    var animationTop = element(by.id('animationTop'));
    var $animationTop = $p('#animationTop:first');
    var toggledNode = element(by.id('toggledNode'));
    var $toggledNode = $p('#toggledNode:first');

    expect(animationTop.allowAnimations()).toBe(true);
    expect($animationTop.allowAnimations()).toBe(true);
    animationTop.allowAnimations(false);
    $animationTop.allowAnimations(false);
    expect(animationTop.allowAnimations()).toBe(false);
    expect($animationTop.allowAnimations()).toBe(false);

    expect(toggledNode.isPresent()).toBe(true);
    expect($toggledNode.is(':present')).toBe(true);
    element(by.id('checkbox')).click();
    expect(toggledNode.isPresent()).toBe(false);
    $p('#checkbox:first').click();
    expect($toggledNode.is(':present')).toBe(true);
  });

  // @todo unable to get the locator
  // it('should keep a reference to the original locator', function() {
  //   browser.get('index.html#/form');

  //   var byCss = by.css('body');
  //   var byBinding = by.binding('greet');

  //   expect(element(byCss).locator()).toEqual(byCss);
  //   expect(element(byBinding).locator()).toEqual(byBinding);
  // });

  it('should propagate exceptions', function() {
    browser.get('index.html#/form');
    var successful = protractor.promise.defer();
    var invalidElement = element(by.binding('INVALID'));
    invalidElement.getText().then(function(value) {
      successful.fulfill(true);
    }, function(err) {
      successful.fulfill(false);
    });
    expect(successful).toEqual(false);
    var $successful = protractor.promise.defer();
    var $invalidElement = $p('{{INVALID}}:first');
    $invalidElement.text().then(function(value) {
      $successful.fulfill(true);
    }, function(err) {
      $successful.fulfill(false);
    });
    expect($successful).toEqual(false);
  });

  it('should be returned from a helper without infinite loops', function() {
    browser.get('index.html#/form');
    var helperPromise = protractor.promise.when(true).then(function() {
      return element(by.binding('greeting'));
    });

    helperPromise.then(function(finalResult) {
      expect(finalResult.getText()).toEqual('Hiya');
    });

    var $helperPromise = protractor.promise.when(true).then(function() {
      return $p('{{greeting}}:first');
    });

    $helperPromise.then(function(finalResult) {
      expect(finalResult.text()).toEqual('Hiya');
    });
  });

  it('should be usable in WebDriver functions via getWebElement', function() {
    // TODO(juliemr): should be able to do this without the getWebElement call
    browser.get('index.html#/form');
    var greeting = element(by.binding('greeting'));
    browser.executeScript('arguments[0].scrollIntoView', greeting.getWebElement());
    var $greeting = $p('{{greeting}}:first');
    browser.executeScript('arguments[0].scrollIntoView', $greeting.eq(0));
  });

  it('should allow null as success handler', function() {
    browser.get('index.html#/form');

    var usernameInput = element(by.model('username'));
    var name = element(by.binding('username'));

    expect(name.getText()).toEqual('Anon');
    expect(
      name.getText().then(null, function() {})
    ).toEqual('Anon');

    var $usernameInput = $p('[ng-model="username"]');
    var $name = $p('{{username}}');

    expect($name.text()).toEqual('Anon');
    expect(
      $name.text().then(null, function() {})
    ).toEqual('Anon');
  });
});

describe('ElementArrayFinder', function() {

  it('action should act on all elements', function() {
    browser.get('index.html#/conflict');

    var multiElement = element.all(by.binding('item.reusedBinding'));
    expect(multiElement.getText()).toEqual(['Outer: outer', 'Inner: inner']);
    var $multiElement = $p('{{item.reusedBinding}}');
    expect($multiElement.text()).toEqual('Outer: outerInner: inner');
  });

  it('click action should act on all elements', function() {
    var checkboxesElms = $$('#checkboxes input');
    browser.get('index.html');

    expect(checkboxesElms.isSelected()).toEqual([true, false, false, false]);
    checkboxesElms.click();
    expect(checkboxesElms.isSelected()).toEqual([false, true, true, true]);
    
    var $checkboxesElms = $p('#checkboxes').find('input');
    browser.get('index.html');
    expect($checkboxesElms.is(':checked')).toEqual(true);
    $checkboxesElms.click();
    expect($checkboxesElms.is(':checked')).toEqual(false);
  });

  it('action should act on all elements selected by filter', function() {
    browser.get('index.html');

    var multiElement = $$('#checkboxes input').filter(function(elem, index) {
      return index == 2 || index == 3;
    });
    multiElement.click();
    expect($('#letterlist').getText()).toEqual('wx');

    var $multiElement = $p('#checkboxes').find('input').filter(function(elem, index) {
      return index == 2 || index == 3;
    });
    $multiElement.click();
    $multiElement.click();
    expect($p('#letterlist').text()).toEqual('wx');
  });

  it('filter should chain with index correctly', function() {
    browser.get('index.html');

    var elem = $$('#checkboxes input').filter(function(elem, index) {
      return index == 2 || index == 3;
    }).last();
    elem.click();
    expect($('#letterlist').getText()).toEqual('x');

    var $elem = $p('#checkboxes').find('input').filter(function(elem, index) {
      return index == 2 || index == 3;
    }).last();
    $elem.click();
    $elem.click();
    expect($p('#letterlist').text()).toEqual('x');
  });

  it('filter should work in page object', function() {
    var elements = element.all(by.css('#animals ul li')).filter(function(elem) {
      return elem.getText().then(function(text) {
        return text === 'big dog';
      });
    });
    browser.get('index.html#/form');
    expect(elements.count()).toEqual(1);
    
    browser.get('index.html');
    var $elements = $p('#animals').find('ul').find('li').filter(function(elem) {
      return elem.getText().then(function(text) {
        return text === 'big dog';
      });
    });
    browser.get('index.html#/form');
    expect($elements.length).toEqual(1);
  });

  it('should be able to get ElementFinder from filtered ElementArrayFinder', function() {
    var isDog = function(elem) {
      return elem.getText().then(function(text) {
        return text.indexOf('dog') > -1;
      });
    };
    var elements = element.all(by.css('#animals ul li')).filter(isDog);
    var $elements = $p('#animals').find('ul').find('li').filter(isDog);
    browser.get('index.html#/form');
    expect(elements.count()).toEqual($elements.length);
    expect(elements.get(2).getText()).toEqual($elements.get(2).text());
  });

  it('filter should be compoundable', function() {
    var isDog = function(elem) {
      return elem.getText().then(function(text) {
        return text.indexOf('dog') > -1;
      });
    };
    var isBig = function(elem) {
      return elem.getText().then(function(text) {
        return text.indexOf('big') > -1;
      });
    };
    var elements = element.all(by.css('#animals ul li')).filter(isDog).filter(isBig);
    var $elements = $p('#animals').find('ul').find('li').filter(isDog).filter(isBig);

    browser.get('index.html#/form');
    expect(elements.count()).toEqual($elements.length);
    elements.then(function(arr) {
      expect(arr[0].getText()).toEqual('big dog');
    });

    $elements.then(function(arr) {
      expect($p(arr[0]).text()).toEqual('big dog');
    });
  });

  it('filter should work with reduce', function() {
    var isDog = function(elem) {
      return elem.getText().then(function(text) {
        return text.indexOf('dog') > -1;
      });
    };
    browser.get('index.html#/form');
    var value = element.all(by.css('#animals ul li')).filter(isDog).
        reduce(function(currentValue, elem, index, elemArr) {
          return elem.getText().then(function(text) {
            return currentValue + index + '/' + elemArr.length + ': ' + text + '\n';
          });
        }, '');
    var $value = $p('#animals').find('ul').find('li').filter(isDog).
        reduce(function(currentValue, elem, index, elemArr) {
          return elem.getText().then(function(text) {
            return currentValue + index + '/' + elemArr.length + ': ' + text + '\n';
          });
        }, '');

    expect(value).toEqual('0/3: big dog\n' +
                          '1/3: small dog\n' +
                          '2/3: other dog\n');
    expect($value).toEqual('0/3: big dog\n' +
                          '1/3: small dog\n' +
                          '2/3: other dog\n');
  });

  it('should find multiple elements scoped properly with chaining', function() {
    browser.get('index.html#/conflict');

    element.all(by.binding('item')).then(function(elems) {
      expect(elems.length).toEqual(4);
    });
    $p('{{item}}').then(function(elems) {
      expect(elems.length).toEqual(4);
    });

    element(by.id('baz')).all(by.binding('item')).then(function(elems) {
      expect(elems.length).toEqual(2);
    });
    $p('#baz').find('{{item}}').then(function(elems) {
      expect(elems.length).toEqual(2);
    });
  });

  it('should wait to grab multiple chained elements', function() {
    // These should throw no error before a page is loaded.
    var reused = element(by.id('baz')).all(by.binding('item'));
    var $reused = $p('#baz').find('{{item}}');

    browser.get('index.html#/conflict');

    expect(reused.count()).toEqual(2);
    expect($reused.length).toEqual(2);
    expect(reused.get(0).getText()).toEqual('Inner: inner');
    expect($reused.get(0).text()).toEqual('Inner: inner');
    expect(reused.last().getText()).toEqual('Inner other: innerbarbaz');
    expect($reused.last().text()).toEqual('Inner other: innerbarbaz');
  });

  it('should wait to grab elements chained by index', function() {
    // These should throw no error before a page is loaded.
    var reused = element(by.id('baz')).all(by.binding('item'));
    var $reused = $p('#baz').find('{{item}}');
    var first = reused.first();
    var $first = $reused.first();
    var second = reused.get(1);
    var $second = $reused.get(1);
    var last = reused.last();
    var $last = $reused.last();

    browser.get('index.html#/conflict');

    expect(reused.count()).toEqual(2);
    expect($reused.length).toEqual(2);
    expect(first.getText()).toEqual('Inner: inner');
    expect($first.text()).toEqual('Inner: inner');
    expect(second.getText()).toEqual('Inner other: innerbarbaz');
    expect($second.text()).toEqual('Inner other: innerbarbaz');
    expect(last.getText()).toEqual('Inner other: innerbarbaz');
    expect($last.text()).toEqual('Inner other: innerbarbaz');
  });

  it('should count all elements', function() {
    browser.get('index.html#/form');

    element.all(by.model('color')).count().then(function(num) {
      expect(num).toEqual(3);
    });
    $p('[ng-model="color"]').length.then(function(num) {
      expect(num).toEqual(3);
    });

    // Should also work with promise expect unwrapping
    expect(element.all(by.model('color')).count()).toEqual(3);
    expect($p('[ng-model="color"]').length).toEqual(3);
  });

  it('should return 0 when counting no elements', function() {
    browser.get('index.html#/form');

    expect(element.all(by.binding('doesnotexist')).count()).toEqual(0);
    expect($p('{{doesnotexist}}').length).toEqual(0);
  });

  it('should return not present when an element disappears within an array', 
      function() {
    browser.get('index.html#/form');
    element.all(by.model('color')).then(function(elements) {
      var disappearingElem = elements[0];
      expect(disappearingElem.isPresent()).toBeTruthy();
      browser.get('index.html#/bindings');
      expect(disappearingElem.isPresent()).toBeFalsy();
    });

    browser.get('index.html#/form');
    $p('[ng-model="color"]').then(function(elements) {
      var $disappearingElem = $p(elements[0]);
      expect($disappearingElem.is(':present')).toBeTruthy();
      browser.get('index.html#/bindings');
      expect($disappearingElem.is(':present')).toBeFalsy();
    });
  });

  it('should get an element from an array', function() {
    var colorList = element.all(by.model('color'));
    var $colorList = $p('[ng-model="color"]');

    browser.get('index.html#/form');

    expect(colorList.get(0).getAttribute('value')).toEqual('blue');
    expect($colorList.get(0).attr('value')).toEqual('blue');
    expect(colorList.get(1).getAttribute('value')).toEqual('green');
    expect($colorList.get(1).attr('value')).toEqual('green');
    expect(colorList.get(2).getAttribute('value')).toEqual('red');
    expect($colorList.get(2).attr('value')).toEqual('red');
  });

  it('should get an element from an array using negative indices', function() {
    var colorList = element.all(by.model('color'));
    var $colorList = $p('[ng-model="color"]');

    browser.get('index.html#/form');

    expect(colorList.get(-3).getAttribute('value')).toEqual('blue');
    expect($colorList.get(-3).attr('value')).toEqual('blue');
    expect(colorList.get(-2).getAttribute('value')).toEqual('green');
    expect($colorList.get(-2).attr('value')).toEqual('green');
    expect(colorList.get(-1).getAttribute('value')).toEqual('red');
    expect($colorList.get(-1).attr('value')).toEqual('red');
  });

  it('should get the first element from an array', function() {
    var colorList = element.all(by.model('color'));
    var $colorList = $p('[ng-model="color"]');
    browser.get('index.html#/form');

    expect(colorList.first().getAttribute('value')).toEqual('blue');
    expect($colorList.first().attr('value')).toEqual('blue');
  });

  it('should get the last element from an array', function() {
    var colorList = element.all(by.model('color'));
    var $colorList = $p('[ng-model="color"]');
    browser.get('index.html#/form');

    expect(colorList.last().getAttribute('value')).toEqual('red');
    expect($colorList.last().attr('value')).toEqual('red');
  });

  it('should perform an action on each element in an array', function() {
    var colorList = element.all(by.model('color'));
    var $colorList = $p('[ng-model="color"]');
    browser.get('index.html#/form');

    colorList.each(function(colorElement) {
      expect(colorElement.getText()).not.toEqual('purple');
    });
    $colorList.each(function(colorElement) {
      expect($p(colorElement).text()).not.toEqual('purple');
    });
  });

  // @todo unable to get the locator
  // it('should keep a reference to the array original locator', function() {
  //   var byCss = by.css('#animals ul li');
  //   var byModel = by.model('color');
  //   browser.get('index.html#/form');

  //   expect(element.all(byCss).locator()).toEqual(byCss);
  //   expect(element.all(byModel).locator()).toEqual(byModel);
  // });

  it('should map each element on array and with promises', function() {
    browser.get('index.html#/form');
    var labels = element.all(by.css('#animals ul li')).map(function(elm, index) {
      return {
        index: index,
        text: elm.getText()
      };
    });
    var $labels = $p('#animals').find('ul').find('li').map(function(elm, index) {
      return {
        index: index,
        text: $p(elm).text()
      };
    });
    expect(labels).toEqual([
      {index: 0, text: 'big dog'},
      {index: 1, text: 'small dog'},
      {index: 2, text: 'other dog'},
      {index: 3, text: 'big cat'},
      {index: 4, text: 'small cat'}
    ]);
    expect($labels).toEqual([
      {index: 0, text: 'big dog'},
      {index: 1, text: 'small dog'},
      {index: 2, text: 'other dog'},
      {index: 3, text: 'big cat'},
      {index: 4, text: 'small cat'}
    ]);
  });

  it('should map and resolve multiple promises', function() {
    browser.get('index.html#/form');
    var labels = element.all(by.css('#animals ul li')).map(function(elm) {
      return {
        text: elm.getText(),
        inner: elm.getInnerHtml()
      };
    });
    var $labels = $p('#animals').find('ul').find('li').map(function(elm) {
      return {
        text: $p(elm).text(),
        inner: $p(elm).html()
      };
    });

    var newExpected = function(expectedLabel) {
      return {
        text: expectedLabel,
        inner: expectedLabel
      };
    };

    expect(labels).toEqual([
      newExpected('big dog'),
      newExpected('small dog'),
      newExpected('other dog'),
      newExpected('big cat'),
      newExpected('small cat')
    ]);
    expect($labels).toEqual([
      newExpected('big dog'),
      newExpected('small dog'),
      newExpected('other dog'),
      newExpected('big cat'),
      newExpected('small cat')
    ]);
  });

  it('should map each element from a literal and promise array', function() {
    browser.get('index.html#/form');
    var i = 1, j = 1;
    var labels = element.all(by.css('#animals ul li')).map(function(elm) {
      return i++;
    });
    var $labels = $p('#animals').find('ul').find('li').map(function(elm) {
      return j++;
    });

    expect(labels).toEqual([1, 2, 3, 4, 5]);
    expect($labels).toEqual([1, 2, 3, 4, 5]);
  });

  it('should filter elements', function() {
    browser.get('index.html#/form');
    var count = element.all(by.css('#animals ul li')).filter(function(elem) {
      return elem.getText().then(function(text) {
        return text === 'big dog';
      });
    }).then(function(filteredElements) {
      return filteredElements.length;
    });
    var $count = $p('#animals').find('ul').find('li').filter(function(elem) {
      return $p(elem).text().then(function(text) {
        return text === 'big dog';
      });
    }).then(function(filteredElements) {
      return filteredElements.length;
    });

    expect($count).toEqual(1);
  });

  it('should reduce elements', function() {
    browser.get('index.html#/form');
    var value = element.all(by.css('#animals ul li')).
        reduce(function(currentValue, elem, index, elemArr) {
          return elem.getText().then(function(text) {
            return currentValue + index + '/' + elemArr.length + ': ' + text + '\n';
          });
        }, '');
    var $value = $p('#animals').find('ul').find('li').
        reduce(function(currentValue, elem, index, elemArr) {
          return $p(elem).text().then(function(text) {
            return currentValue + index + '/' + elemArr.length + ': ' + text + '\n';
          });
        }, '');

    expect(value).toEqual('0/5: big dog\n' +
                          '1/5: small dog\n' +
                          '2/5: other dog\n' +
                          '3/5: big cat\n' +
                          '4/5: small cat\n');
    expect($value).toEqual('0/5: big dog\n' +
                          '1/5: small dog\n' +
                          '2/5: other dog\n' +
                          '3/5: big cat\n' +
                          '4/5: small cat\n');
  });

  it('should allow using protractor locator within map', function() {
    browser.get('index.html#/repeater');

    var expected = [
        { first: 'M', second: 'Monday' },
        { first: 'T', second: 'Tuesday' },
        { first: 'W', second: 'Wednesday' },
        { first: 'Th', second: 'Thursday' },
        { first: 'F', second: 'Friday' }];

    var result = element.all(by.repeater('allinfo in days')).map(function(el) {
      return {
        first: el.element(by.binding('allinfo.initial')).getText(),
        second: el.element(by.binding('allinfo.name')).getText()
      };
    });

    expect(result).toEqual(expected);
  });
});

// @todo find a use-case for `evaluate`
// describe('evaluating statements', function() {
//   beforeEach(function() {
//     browser.get('index.html#/form');
//   });
//   it('should evaluate statements in the context of an element', function() {
//     var checkboxElem = element(by.id('checkboxes'));
//     checkboxElem.evaluate('show').then(function(output) {
//       expect(output).toBe(true);
//     });
//     // Make sure it works with a promise expectation.
//     expect(checkboxElem.evaluate('show')).toBe(true);
//   });
// });

// @todo check if we can use $ and $$ in $p() call
// describe('shortcut css notation', function() {
//   beforeEach(function() {
//     browser.get('index.html#/bindings');
//   });
//   it('should grab by css', function() {
//     expect($('.planet-info').getText()).
//         toEqual(element(by.css('.planet-info')).getText());
//     expect($$('option').count()).toEqual(element.all(by.css('option')).count());
//   });
//   it('should chain $$ with $', function() {
//     var withoutShortcutCount =
//         element(by.css('select')).all(by.css('option')).then(function(options) {
//           return options.length;
//         });
//     var withShortcutCount = $('select').$$('option').count();

//     expect(withoutShortcutCount).toEqual(withShortcutCount);
//   });
// });
