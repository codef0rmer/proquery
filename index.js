module.exports = function(selector) {
  var init = function(selector, context) {
    if (typeof selector === 'object') return exposePublicAPIs(selector);

    if (switchToDefault(this)) browser.driver.switchTo().defaultContent();

    var $p,
        isActiveElement = selector === ':focus',
        isIFrame        = !!selector.match(/^iframe[#.]/),
        baseSelector    = isIFrame ? selector.replace(/^iframe([#.])/, '$1') : selector.replace(/:first|:last$/, ''),
        psuedoSelector  = (selector.match(/:first|:last$/) || [""])[0].substr(1),
        nestedSelector  = !!baseSelector.match(/\s+(?=[^\])}]*([\[({]|$))/), // consists of space but not within :contains()
        isLinkFilter    = baseSelector.indexOf('a:contains') === 0,
        isButtonFilter  = baseSelector.indexOf('button:contains') === 0,
        filterText      = !!baseSelector.match(/:contains\((.*)+\)/) && ( baseSelector.match(/:contains\((.*)+\)/)[1] || '' ).replace(/'/g, '').replace(/"/g, ''),
        atIndex         = parseInt(!!baseSelector.match(/:eq\((.*)+\)/) && baseSelector.match(/:eq\((.*)+\)/)[1] || -1, false),
        isClass         = nestedSelector || baseSelector.indexOf('.') === 0,
        isBinding       = !!baseSelector.match(/{{[A-Za-z0-9\.\|_]+\}}/g),
        isNgModel       = baseSelector.indexOf('[ng-model=') === 0,
        isNgRepeat      = baseSelector.indexOf('[ng-repeat=') === 0,
        isNgOption      = baseSelector.indexOf('[ng-options=') === 0,
        isId            = !nestedSelector && baseSelector.indexOf('#') === 0,
        context         = context || this;

    // #animals ul .pet:contains("dog")
    if (nestedSelector) baseSelector = baseSelector.split(':')[0];

    // :contains() for links and buttons
    if (isLinkFilter || isButtonFilter) baseSelector = ( baseSelector.match(/:contains\((.*)+\)/)[1] || '').replace(/'/g, '').replace(/"/g, '');
    
    // :eq() for elements by id
    if (atIndex >= 0) baseSelector = baseSelector.replace(/:eq\((.*)+\)/, '');

    // skip # from ID
    if (isId) baseSelector = baseSelector.substr(1);

    // skip {{ }} from bindings
    if (isBinding) baseSelector = baseSelector.replace(/{|}/g, '');

    // skip "" or '' from ngModel
    if (isNgModel || isNgRepeat || isNgOption) baseSelector = baseSelector.split('"')[1] || selector.split('\'')[1];

    if (isActiveElement) {
      $p = browser.driver.switchTo().activeElement();
    } else if (context.locator && context.locator().toString().indexOf('by.repeater') >= 0) {
      $p = element.all(context.locator().column(baseSelector));
    } else if (nestedSelector) {
      $p = context.all(by.cssContainingText(baseSelector, filterText));
    } else if (isButtonFilter) {
      $p = context.all(by.partialButtonText(baseSelector));
    } else if (isLinkFilter) {
      $p = context.all(by.partialLinkText(baseSelector));
    } else if (isBinding) {
      $p = context.all(by.binding(baseSelector));
    } else if (isNgModel) {
      $p = context.all(by.model(baseSelector));
    } else if (isNgRepeat) {
      $p = context.all(by.repeater(baseSelector));
    } else if (isNgOption) {
      $p = context.all(by.options(baseSelector));
    } else if (isId) {
      $p = context.all(by.id(baseSelector));
    } else {
      $p = context.all(by.css(baseSelector));
    }

    if (atIndex >= 0) {
      $p = $p.get(atIndex);
    }

    $p = exposePublicAPIs($p, psuedoSelector, {
      context       : context,
      baseSelector  : baseSelector,
      isNgRepeat    : isNgRepeat,
      isIFrame      : isIFrame,
      isClass       : isClass,
      atIndex       : atIndex,
      isId          : isId
    });

    return $p;
  };

  var exposePublicAPIs = function($p, psuedoSelector, opts) {
    // For psuedo such username:first or username:last
    if (psuedoSelector === 'first') {
      $p = $p.first();
      $p.length = $p.isPresent().then(function() { return 1; }, function() { return 0; });
    } else if (psuedoSelector === 'last') {
      $p = $p.last();
      $p.length = $p.isPresent().then(function() { return 1; }, function() { return 0; });
    } else {
      try {
        $p.length = $p.count().then(function(length) { return length; }, function() { return 0; });
      } catch(e) {
        try {
          $p.length = $p.isPresent().then(function() { return 1; }, function() { return 0; });
        } catch(e) {
          // for browser.driver.switchTo().activeElement() call mostly
          $p.length = $p.then(function() { return 1; }, function() { return 0; });
        }
      }
    }

    // backup native methods before overriding
    $p.filterNative = $p.filter;
    $p.getNative = $p.get;
    $p.firstNative = $p.first;
    $p.lastNative = $p.last;
    
    $p.val = function(value) {
      if (value === '' || !!value) {
        return this.clear().then(function() { return this.sendKeys(value) }.bind(this)); 
      } else {
        return typeof this.each === 'function' ? this.getNative(0).getAttribute('value') : this.getAttribute('value');
      }
    };

    $p.text = function() {
      return this.getText().then(function(text) { return typeof text === 'string' ? text : text.join(''); });
    };

    $p.html = function() {
      var $this = typeof this.each === 'function' ? this.getNative(0) : this;
      return $this.getInnerHtml().then(function(html) { return html; });
    };

    $p.attr = function(attribute) {
      return typeof this.each === 'function' ? this.getNative(0).getAttribute(attribute) : this.getAttribute(attribute);
    };

    $p.animate = function(properties) {
      return browser.actions().dragAndDrop(typeof this.each === 'function' ? this.first() : this, properties).perform();
    };

    $p.is = function(check) {
      var $this = typeof this.each === 'function' ? this.first() : this;
      if (check === ':present') {
        return  $this.isPresent().then(function(isPresent) { return isPresent; }, function() { return false; });
      } else if (check === ':visible') {
        return  $this.isDisplayed().then(function(isVisible) { return isVisible; }, function() { return false; });
      } else if (check === ':checked') {
        return $this.isSelected();
      }
    };

    $p.filter = function(fn) {
      return exposePublicAPIs(this.filterNative(fn));
    };

    $p.eq = function(elementIndex) {
      if (typeof this.each === 'function' && elementIndex >= 0) {
        return this.filter(function(el, i) { 
          return i === elementIndex;
        }).first().getWebElement();
      } else if (elementIndex === 0) {
        return this.getWebElement();
      } else {
        return undefined;
      }
    };

    $p.get = function(elementIndex) {
      var that;
      if (opts && opts.isNgRepeat) {
        that = exposePublicAPIs(opts.context.all(this.locator().row(elementIndex)));
      } else {
        if (opts) opts.atIndex = elementIndex;
        that = exposePublicAPIs(this.getNative(elementIndex), '', opts);
      }
      
      return that;
    };

    $p.first = function() {
      return exposePublicAPIs(this.getNative(0));
    };

    $p.last = function() {
      return exposePublicAPIs(this.getNative(-1));
    };

    $p.contents = function() {
      var $that;

      if (typeof this.each === 'function') {
        opts.atIndex = 0;
        $that = this.first();
      } else {
        $that = this;
      }

      if (opts && opts.isIFrame) {
        if (opts.isId) {
          browser.driver.switchTo().frame(browser.driver.findElement(protractor.By.id(opts.baseSelector)));
        } else {
          browser.driver.switchTo().frame(browser.driver.findElement(protractor.By.css(opts.baseSelector)));
        }
      } else if (opts && opts.atIndex >= 0) {
        browser.driver.switchTo().frame(opts.atIndex);
      }
      
      // this is a first-timer dummy .find method for frames that overrides 
      // `this` (which is NodeJS process object) with Protractor `element`.
      // Howerver, for nested .find calls, the default one will be used.
      $that.find = function(selector) {
        var self;
        self = init.call(this, selector, element);
        return self;
      };

      return $that;
    };

    $p.find = init;

    return $p;
  };

  return init(selector, element);
};

function switchToDefault(self) {
  return typeof self.process === 'object';
}