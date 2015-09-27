var $p = require('../../../index.js');

describe('locators', function() {
  beforeEach(function() {
    browser.get('index.html#/form');
  });

  describe('by binding', function() {
    it('should find an element by binding', function() {
      var greeting = element(by.binding('greeting'));
      var $greeting = $p('{{greeting}}:first');

      expect(greeting.getText()).toEqual('Hiya');
      expect($greeting.text()).toEqual('Hiya');
    });

    it('should find a binding by partial match', function() {
      var greeting = element(by.binding('greet'));
      var $greeting = $p('{{greet}}:first');

      expect(greeting.getText()).toEqual('Hiya');
      expect($greeting.text()).toEqual('Hiya');
    });

    // @todo
    // it('should find exact match by exactBinding', function() {
    //   var greeting = element(by.exactBinding('greeting'));
    //   expect(greeting.getText()).toEqual('Hiya');
    // });

    // @todo
    // it('should not find partial match by exactBinding', function() {
    //   var greeting = element(by.exactBinding('greet'));
    //   expect(greeting.isPresent()).toBe(false);
    // });

    it('should find an element by binding with ng-bind attribute',
        function() {
      var name = element(by.binding('username'));
      var $name = $p('{{username}}');

      expect(name.getText()).toEqual('Anon');
      expect($name.text()).toEqual('Anon');
    });

    it('should find an element by binding with ng-bind-template attribute',
        function() {
      var name = element(by.binding('nickname|uppercase'));
      var $name = $p('{{nickname|uppercase}}:first');

      expect(name.getText()).toEqual('(ANNIE)');
      expect($name.text()).toEqual('(ANNIE)');
    });
  });

  describe('by model', function() {
    it('should find an element by text input model', function() {
      var username = element(by.model('username'));
      var $username = $p('[ng-model="username"]:first');
      var name = element(by.binding('username'));
      var $name = $p('{{username}}:first');

      username.clear();
      expect(name.getText()).toEqual('');
      expect($name.text()).toEqual('');

      username.sendKeys('Jane Doe');
      expect(name.getText()).toEqual('Jane Doe');
      expect($name.text()).toEqual('Jane Doe');
    });

    it('should find an element by checkbox input model', function() {
      expect(element(by.id('shower')).isDisplayed()).toBe(true);
      expect($p('#shower:first').is(':visible')).toBe(true);

      var colors = element(by.model('show')).click();

      expect(element(by.id('shower')).isDisplayed()).toBe(false);
      expect($p('#shower:first').is(':visible')).toBe(false);
    });

    it('should find a textarea by model', function() {
      var about = element(by.model('aboutbox'));
      var $about = $p('[ng-model="aboutbox"]:first');
      expect(about.getAttribute('value')).toEqual('This is a text box');
      expect($about.attr('value')).toEqual('This is a text box');

      about.clear();
      about.sendKeys('Something else to write about');

      expect(about.getAttribute('value')).
          toEqual('Something else to write about');
      expect($about.attr('value')).
          toEqual('Something else to write about');
    });

    it('should find multiple selects by model', function() {
      var selects = element.all(by.model('dayColor.color'));
      var $selects = $p('[ng-model="dayColor.color"]');
      expect(selects.count()).toEqual(3);
      expect($selects.length).toEqual(3);
    });

    it('should find the selected option', function() {
      var select = element(by.model('fruit'));
      var $select = $p('[ng-model="fruit"]');
      var selectedOption = select.element(by.css('option:checked'));
      var $selectedOption = $select.find('option:checked');
      expect(selectedOption.getText()).toEqual('apple');
      expect($selectedOption.text()).toEqual('apple');
    });

    it('should find inputs with alternate attribute forms', function() {
      var letterList = element(by.id('letterlist'));
      var $letterList = $p('#letterlist:first');
      expect(letterList.getText()).toBe('');
      expect($letterList.text()).toBe('');

      element(by.model('check.w')).click();
      expect(letterList.getText()).toBe('w');
      $p('[ng-model="check.w"]').click().click();
      expect($letterList.text()).toBe('w');

      element(by.model('check.x')).click();
      expect(letterList.getText()).toBe('wx');
      $p('[ng-model="check.w"]').click().click();
      expect($letterList.text()).toBe('wx');
    });

    it('should find multiple inputs', function() {
      element.all(by.model('color')).then(function(arr) {
        expect(arr.length).toEqual(3);
      });
      $p('[ng-model="color"]').then(function(arr) {
        expect(arr.length).toEqual(3);
      });
    });

    it('should clear text from an input model', function() {
      var username = element(by.model('username'));
      var $username = $p('[ng-model="username"]');
      var name = element(by.binding('username'));
      var $name = $p('{{username}}');

      username.clear();
      expect(name.getText()).toEqual('');
      expect($name.text()).toEqual('');

      username.sendKeys('Jane Doe');
      expect(name.getText()).toEqual('Jane Doe');
      $username.val('Jane Doe');
      expect($name.text()).toEqual('Jane Doe');

      username.clear();
      $username.val('');
      expect(name.getText()).toEqual('');
      expect($name.text()).toEqual('');
    });
  });

  describe('by partial button text', function() {
    it('should find multiple buttons containing "text"', function() {
      element.all(by.partialButtonText('text')).then(function(arr) {
        expect(arr.length).toEqual(4);
        expect(arr[0].getAttribute('id')).toBe('exacttext');
        expect(arr[1].getAttribute('id')).toBe('otherbutton');
        expect(arr[2].getAttribute('id')).toBe('submitbutton');
        expect(arr[3].getAttribute('id')).toBe('inputbutton');
      });
      $p('button:contains("text")').then(function(arr) {
        expect(arr.length).toEqual(4);
        expect($p(arr[0]).attr('id')).toBe('exacttext');
        expect($p(arr[1]).attr('id')).toBe('otherbutton');
        expect($p(arr[2]).attr('id')).toBe('submitbutton');
        expect($p(arr[3]).attr('id')).toBe('inputbutton');
      });
    });
  });

  // @todo
  // describe('by button text', function() {
  //   it('should find two button containing "Exact text"', function() {
  //     element.all(by.buttonText('Exact text')).then(function(arr) {
  //       expect(arr.length).toEqual(2);
  //       expect(arr[0].getAttribute('id')).toBe('exacttext');
  //       expect(arr[1].getAttribute('id')).toBe('submitbutton');
  //     });
  //   });
  //   it('should not find any buttons containing "text"', function() {
  //     element.all(by.buttonText('text')).then(function(arr) {
  //       expect(arr.length).toEqual(0);
  //     });
  //   });
  // });

  describe('by repeater', function() {
    beforeEach(function() {
      browser.get('index.html#/repeater');
    });

    it('should find by partial match', function() {
      var fullMatch = element(by.repeater('baz in days | filter:\'T\'').row(0).column('baz.initial'));
      var $fullMatch = $p('[ng-repeat="baz in days | filter:\'T\'"]').get(0).find('baz.initial');
      expect(fullMatch.getText()).toEqual('T');
      expect($fullMatch.text()).toEqual('T');

      var partialMatch = element(by.repeater('baz in days').row(0).column('b'));
      var $partialMatch = $p('[ng-repeat="baz in days"]').get(0).find('b');
      expect(partialMatch.getText()).toEqual('T');
      expect($partialMatch.text()).toEqual('T');

      var partialRowMatch = element(by.repeater('baz in days').row(0));
      var $partialRowMatch = $p('[ng-repeat="baz in days"]').get(0);
      expect(partialRowMatch.getText()).toEqual('T');
      expect($partialRowMatch.text()).toEqual('T');
    });

    it('should return all rows when unmodified', function() {
      var all = element.all(by.repeater('allinfo in days'));
      var $all = $p('[ng-repeat="allinfo in days"]');
      all.then(function(arr) {
        expect(arr.length).toEqual(5);
        expect(arr[0].getText()).toEqual('M Monday');
        expect(arr[1].getText()).toEqual('T Tuesday');
        expect(arr[2].getText()).toEqual('W Wednesday');
      });
      $all.then(function(arr) {
        expect(arr.length).toEqual(5);
        expect(arr[0].getText()).toEqual('M Monday');
        expect(arr[1].getText()).toEqual('T Tuesday');
        expect(arr[2].getText()).toEqual('W Wednesday');
      });
    });

    it('should return a single column', function() {
      var initials = element.all(by.repeater('allinfo in days').column('initial'));
      var $initials = $p('[ng-repeat="allinfo in days"]').find('initial');
      initials.then(function(arr) {
        expect(arr.length).toEqual(5);
        expect(arr[0].getText()).toEqual('M');
        expect(arr[1].getText()).toEqual('T');
        expect(arr[2].getText()).toEqual('W');
      });
      $initials.then(function(arr) {
        expect(arr.length).toEqual(5);
        expect(arr[0].getText()).toEqual('M');
        expect(arr[1].getText()).toEqual('T');
        expect(arr[2].getText()).toEqual('W');
      });

      var names = element.all(by.repeater('allinfo in days').column('name'));
      var $names = $p('[ng-repeat="allinfo in days"]').find('name');
      names.then(function(arr) {
        expect(arr.length).toEqual(5);
        expect(arr[0].getText()).toEqual('Monday');
        expect(arr[1].getText()).toEqual('Tuesday');
        expect(arr[2].getText()).toEqual('Wednesday');
      });
      $names.then(function(arr) {
        expect(arr.length).toEqual(5);
        expect(arr[0].getText()).toEqual('Monday');
        expect(arr[1].getText()).toEqual('Tuesday');
        expect(arr[2].getText()).toEqual('Wednesday');
      });
    });

    it('should allow chaining while returning a single column', function() {
      var secondName = element(by.css('.allinfo')).element(by.repeater('allinfo in days').column('name').row(2));
      var $secondName = $p('.allinfo').find('[ng-repeat="allinfo in days"]').find('name').get(2);
      expect(secondName.getText()).toEqual('Wednesday');
      expect($secondName.text()).toEqual('Wednesday');
    });

    it('should return a single row', function() {
      var secondRow = element(by.repeater('allinfo in days').row(1));
      var $secondRow = $p('[ng-repeat="allinfo in days"]:first').get(1);
      expect(secondRow.getText()).toEqual('T Tuesday');
      expect($secondRow.text()).toEqual('T Tuesday');
    });

    it('should return an individual cell', function() {
      var secondNameByRowFirst = element(by.repeater('allinfo in days').row(1).column('name'));
      var $secondNameByRowFirst = $p('[ng-repeat="allinfo in days"]:first').get(1).find('name');
      var secondNameByColumnFirst = element(by.repeater('allinfo in days').column('name').row(1));
      var $secondNameByColumnFirst = $p('[ng-repeat="allinfo in days"]:first').find('name').get(1);

      expect(secondNameByRowFirst.getText()).toEqual('Tuesday');
      expect($secondNameByRowFirst.text()).toEqual('Tuesday');
      expect(secondNameByColumnFirst.getText()).toEqual('Tuesday');
      expect($secondNameByColumnFirst.text()).toEqual('Tuesday');
    });

    it('should find a using data-ng-repeat', function() {
      var byRow = element(by.repeater('day in days').row(2));
      var $byRow = $p('[ng-repeat="day in days"]:first').get(2);
      expect(byRow.getText()).toEqual('W');
      expect($byRow.text()).toEqual('W');

      var byCol = element(by.repeater('day in days').row(2).column('day'));
      var $byCol = $p('[ng-repeat="day in days"]:first').get(2).find('day');
      expect(byCol.getText()).toEqual('W');
      expect($byCol.text()).toEqual('W');
    });

    it('should find using ng:repeat', function() {
      var byRow = element(by.repeater('bar in days').row(2));
      var $byRow = $p('[ng-repeat="bar in days"]:first').get(2);
      expect(byRow.getText()).toEqual('W');
      expect($byRow.text()).toEqual('W');

      var byCol = element(by.repeater('bar in days').row(2).column('bar'));
      var $byCol = $p('[ng-repeat="bar in days"]:first').get(2).find('bar');
      expect(byCol.getText()).toEqual('W');
      expect($byCol.text()).toEqual('W');
    });

    it('should determine if repeater elements are present', function() {
      expect(element(by.repeater('allinfo in days').row(3)).isPresent()).toBe(true);
      expect($p('[ng-repeat="allinfo in days"]:first').get(3).is(':present')).toBe(true);
      // There are only 5 rows, so the 6th row is not present.
      expect(element(by.repeater('allinfo in days').row(5)).isPresent()).toBe(false);
      expect($p('[ng-repeat="allinfo in days"]:first').get(5).is(':present')).toBe(false);
    });

    // @todo
    // it('should have by.exactRepeater working', function() {
    //   expect(element(by.exactRepeater('day in d')).isPresent()).toBe(false);
    //   expect(element(by.exactRepeater('day in days')).isPresent()).toBe(true);
    //   // Full ng-repeat: baz in tDays = (days | filter:'T')
    //   var repeaterWithEqualSign = element(
    //       by.exactRepeater('baz in tDays').row(0));
    //   expect(repeaterWithEqualSign.getText()).toEqual('T');
    //   // Full ng-repeat: baz in days | filter:'T'
    //   var repeaterWithPipe = element(
    //       by.exactRepeater('baz in days').row(0));
    //   expect(repeaterWithPipe.getText()).toEqual('T');
    // });

    describe('repeaters using ng-repeat-start and ng-repeat-end', function() {
      it('should return all elements when unmodified', function() {
        var all = element.all(by.repeater('bloop in days'));
        var $all = $p('[ng-repeat="bloop in days"]');

        all.then(function(arr) {
          expect(arr.length).toEqual(3 * 5);
          expect(arr[0].getText()).toEqual('M');
          expect(arr[1].getText()).toEqual('-');
          expect(arr[2].getText()).toEqual('Monday');
          expect(arr[3].getText()).toEqual('T');
          expect(arr[4].getText()).toEqual('-');
          expect(arr[5].getText()).toEqual('Tuesday');
        });
        $all.then(function(arr) {
          expect(arr.length).toEqual(3 * 5);
          expect(arr[0].getText()).toEqual('M');
          expect(arr[1].getText()).toEqual('-');
          expect(arr[2].getText()).toEqual('Monday');
          expect(arr[3].getText()).toEqual('T');
          expect(arr[4].getText()).toEqual('-');
          expect(arr[5].getText()).toEqual('Tuesday');
        });
      });

      it('should return a group of elements for a row', function() {
        var firstRow = element.all(by.repeater('bloop in days').row(0));
        var $firstRow = $p('[ng-repeat="bloop in days"]').get(0);

        firstRow.then(function(arr) {
          expect(arr.length).toEqual(3);
          expect(arr[0].getText()).toEqual('M');
          expect(arr[1].getText()).toEqual('-');
          expect(arr[2].getText()).toEqual('Monday');
        });
        $firstRow.then(function(arr) {
          expect(arr.length).toEqual(3);
          expect(arr[0].getText()).toEqual('M');
          expect(arr[1].getText()).toEqual('-');
          expect(arr[2].getText()).toEqual('Monday');
        });
      });

      it('should return a group of elements for a column', function() {
        var nameColumn = element.all(by.repeater('bloop in days').column('name'));
        var $nameColumn = $p('[ng-repeat="bloop in days"]').find('name');

        nameColumn.then(function(arr) {
          expect(arr.length).toEqual(5);
          expect(arr[0].getText()).toEqual('Monday');
          expect(arr[1].getText()).toEqual('Tuesday');
        });
        $nameColumn.then(function(arr) {
          expect(arr.length).toEqual(5);
          expect(arr[0].getText()).toEqual('Monday');
          expect(arr[1].getText()).toEqual('Tuesday');
        });
      });

      it('should find an individual element', function() {
        var firstInitial = element(by.repeater('bloop in days').row(0).column('bloop.initial'));
        var $firstInitial = $p('[ng-repeat="bloop in days"]:first').get(0).find('bloop.initial');

        expect(firstInitial.getText()).toEqual('M');
        expect($firstInitial.text()).toEqual('M');
      });
    });
  });

  describe('by css containing text', function() {
    it('should find elements by css and partial text', function() {
      element.all(by.cssContainingText('#animals ul .pet', 'dog')).then(function(arr) {
        expect(arr.length).toEqual(2);
        expect(arr[0].getAttribute('id')).toBe('bigdog');
        expect(arr[1].getAttribute('id')).toBe('smalldog');
      });

      $p('#animals ul .pet:contains("dog")').then(function(arr) {
        expect(arr.length).toEqual(2);
        expect(arr[0].getAttribute('id')).toBe('bigdog');
        expect(arr[1].getAttribute('id')).toBe('smalldog');
      });
    });

    it('should find elements with text-transform style', function() {
      expect(element(by.cssContainingText('#transformedtext div', 'Uppercase')).getAttribute('id')).toBe('textuppercase');
      expect($p('#transformedtext div:contains("Uppercase")').attr('id')).toBe('textuppercase');
      expect(element(by.cssContainingText('#transformedtext div', 'Lowercase')).getAttribute('id')).toBe('textlowercase');
      expect($p('#transformedtext div:contains("Lowercase")').attr('id')).toBe('textlowercase');
      expect(element(by.cssContainingText('#transformedtext div', 'capitalize')).getAttribute('id')).toBe('textcapitalize');
      expect($p('#transformedtext div:contains("capitalize")').attr('id')).toBe('textcapitalize');
    });
  });

  describe('by options', function() {
    it('should find elements by options', function() {
      var allOptions = element.all(by.options('fruit for fruit in fruits'));
      var $allOptions = $p('[ng-options="fruit for fruit in fruits"]');
      expect(allOptions.count()).toEqual(4);
      expect($allOptions.length).toEqual(4);

      var firstOption = allOptions.first();
      var $firstOption = $allOptions.first();
      expect(firstOption.getText()).toEqual('apple');
      expect($firstOption.text()).toEqual('apple');
    });
  });

  // @todo
  // describe('by deep css', function() {
  //   beforeEach(function() {
  //     browser.get('index.html#/shadow');
  //   });
  //   // Shadow DOM is not currently supported outside of Chrome.
  //   browser.getCapabilities().then(function(capabilities) {
  //     if (capabilities.get('browserName') == 'chrome') {
  //       it('should find items inside the shadow DOM', function() {
  //         var parentHeading = element(by.deepCss('.parentshadowheading'));
  //         var olderChildHeading = element(by.deepCss('.oldershadowheading'));
  //         var youngerChildHeading = element(by.deepCss('.youngershadowheading'));
  //         expect(parentHeading.isPresent()).toBe(true);
  //         expect(olderChildHeading.isPresent()).toBe(true);
  //         expect(youngerChildHeading.isPresent()).toBe(true);
  //         expect(parentHeading.getText()).toEqual('Parent');
  //         expect(olderChildHeading.getText()).toEqual('Older Child');
  //         expect(youngerChildHeading.getText()).toEqual('Younger Child');
  //         expect(element(by.deepCss('.originalcontent')).getText())
  //             .toEqual('original content');
  //       });
  //     }
  //   });
  // });

  it('should determine if an element is present', function() {
    expect(browser.isElementPresent(by.binding('greet'))).toBe(true);
    expect(browser.isElementPresent(by.binding('nopenopenope'))).toBe(false);
  });

  it('should determine if an ElementFinder is present', function() {
    expect(browser.isElementPresent(element(by.binding('greet')))).toBe(true);
    expect(browser.isElementPresent(element(by.binding('nopenopenope')))).toBe(false);
  });
});
