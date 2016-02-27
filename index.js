'use strict';

var REGEX_ID                              = /^#/;
var REGEX_CLASS                           = /^./;
var REGEX_IFRAME                          = /^iframe[#.]/;
var REGEX_NGMODEL                         = /^\[ng-model=/;
var REGEX_NGREPEAT                        = /^\[ng-repeat=/;
var REGEX_NGOPTIONS                       = /^\[ng-options=/;
var REGEX_NGBINDING                       = /^{{[A-Za-z0-9\.\|_]+\}}/;
var REGEX_EXTRACT_TEXT                    = /:contains\((.*)+\)/;
var REGEX_EXTRACT_INDEX                   = /:eq\((.*)+\)/;
var REGEX_ACTIVE_ELEMENT                  = /^:focus$/;
var REGEX_SELECTOR_IFRAME                 = /^iframe([#.])/;
var REGEX_SELECTOR_NESTED                 = /\s+(?=[^\])}]*([\[({]|$))/;
var REGEX_PSUEDO_SELECTOR_LINK            = /^a:contains/;
var REGEX_PSUEDO_SELECTOR_BUTTON          = /^button:contains/;
var REGEX_PSUEDO_SELECTOR_FIRST_OR_LAST   = /:first|:last$/;

var ALL_FUNCTIONS    = ['length', 'val', 'text', 'html', 'attr', 'animate', 'is', 'filter', 'eq', 'get', 'first', 'last', 'contents', 'find', 'end'];
var FIND_FUNCTIONS   = ['length', 'val', 'text', 'html', 'attr', 'animate', 'is', 'filter', 'eq', 'get', 'first', 'last', 'find', 'end'];
var FILTER_FUNCTIONS = ['length', 'val', 'text', 'html', 'attr', 'animate', 'is', 'filter', 'eq', 'get', 'first', 'last', 'end'];
var GET_FUNCTIONS    = ['length', 'val', 'text', 'html', 'attr', 'animate', 'is', 'filter', 'eq', 'contents', 'end'];
var FIRST_FUNCTIONS  = ['length', 'val', 'text', 'html', 'attr', 'animate', 'is', 'eq'];

function Proquery(sel_or_ptor, useOriginal) {
  // For native $ behavior that returns a single matched element,
  if (useOriginal === true) return element(by.css(sel_or_ptor));
  return Proquery.prototype.init(sel_or_ptor, element);
}

Proquery.prototype.init = function(sel_or_ptor, context) {
  if (typeof sel_or_ptor === 'object') return Proquery.prototype.extend(sel_or_ptor);

  var $p,
      isProqueried    = this.ptor_,
      isActiveElement = !!sel_or_ptor.match(REGEX_ACTIVE_ELEMENT),
      isIFrame        = !!sel_or_ptor.match(REGEX_IFRAME),
      baseSelector    = isIFrame ? sel_or_ptor.replace(REGEX_SELECTOR_IFRAME, '$1') : sel_or_ptor.replace(REGEX_PSUEDO_SELECTOR_FIRST_OR_LAST, ''),
      psuedoSelector  = (sel_or_ptor.match(REGEX_PSUEDO_SELECTOR_FIRST_OR_LAST) || [''])[0].substr(1),
      nestedSelector  = !!baseSelector.match(REGEX_SELECTOR_NESTED), // consists of space but not within :contains()
      isLinkFilter    = !!baseSelector.match(REGEX_PSUEDO_SELECTOR_LINK),
      isButtonFilter  = !!baseSelector.match(REGEX_PSUEDO_SELECTOR_BUTTON),
      filterText      = !!baseSelector.match(REGEX_EXTRACT_TEXT) && ( baseSelector.match(REGEX_EXTRACT_TEXT)[1] || '' ).replace(/'/g, '').replace(/"/g, ''),
      atIndex         = parseInt(!!baseSelector.match(REGEX_EXTRACT_INDEX) && baseSelector.match(REGEX_EXTRACT_INDEX)[1] || -1, false),
      isClass         = nestedSelector || !!baseSelector.match(REGEX_CLASS),
      isBinding       = !!baseSelector.match(REGEX_NGBINDING),
      isNgModel       = !!baseSelector.match(REGEX_NGMODEL),
      isNgRepeat      = !!baseSelector.match(REGEX_NGREPEAT),
      isNgOption      = !!baseSelector.match(REGEX_NGOPTIONS),
      isId            = !nestedSelector && !!baseSelector.match(REGEX_ID),
      context         = context || this;

  // #animals ul .pet:contains("dog")
  if (nestedSelector) baseSelector = baseSelector.split(':')[0];

  // :contains() for links and buttons
  if (isLinkFilter || isButtonFilter) baseSelector = ( baseSelector.match(REGEX_EXTRACT_TEXT)[1] || '').replace(/'/g, '').replace(/"/g, '');
  
  // :eq() for elements by id
  if (atIndex >= 0) baseSelector = baseSelector.replace(REGEX_EXTRACT_INDEX, '');

  // skip # from ID
  if (isId) baseSelector = baseSelector.substr(1);

  // skip {{ }} from bindings
  if (isBinding) baseSelector = baseSelector.replace(/{|}/g, '');

  // skip "" or '' from ngModel
  if (isNgModel || isNgRepeat || isNgOption) baseSelector = baseSelector.split('"')[1] || baseSelector.split('\'')[1];

  if (isActiveElement) {
    $p = browser.driver.switchTo().activeElement();
  } else if (context.locator && context.locator().toString().indexOf('by.repeater') >= 0) {
    $p = isFirst() ? isChained() ? context.element(context.locator().column(baseSelector)) : context(context.locator().column(baseSelector)) : element.all(context.locator().column(baseSelector));
  } else if (nestedSelector) {
    $p = isFirst() ? isChained() ? context.element(by.cssContainingText(baseSelector, filterText)) : context(by.cssContainingText(baseSelector, filterText)) : context.all(by.cssContainingText(baseSelector, filterText));
  } else if (isButtonFilter) {
    $p = isFirst() ? isChained() ? context.element(by.partialButtonText(baseSelector)) : context(by.partialButtonText(baseSelector)) : context.all(by.partialButtonText(baseSelector));
  } else if (isLinkFilter) {
    $p = isFirst() ? isChained() ? context.element(by.partialLinkText(baseSelector)) : context(by.partialLinkText(baseSelector)) : context.all(by.partialLinkText(baseSelector));
  } else if (isBinding) {
    $p = isFirst() ? isChained() ? context.element(by.binding(baseSelector)) : context(by.binding(baseSelector)) : context.all(by.binding(baseSelector));
  } else if (isNgModel) {
    $p = isFirst() ? isChained() ? context.element(by.model(baseSelector)) : context(by.model(baseSelector)) : context.all(by.model(baseSelector));
  } else if (isNgRepeat) {
    $p = isFirst() ? isChained() ? context.element(by.repeater(baseSelector)) : context(by.repeater(baseSelector)) : context.all(by.repeater(baseSelector));
  } else if (isNgOption) {
    $p = isFirst() ? isChained() ? context.element(by.options(baseSelector)) : context(by.options(baseSelector)) : context.all(by.options(baseSelector));
  } else if (isId) {
    $p = isFirst() ? isChained() ? context.element(by.id(baseSelector)) : context(by.id(baseSelector)) : context.all(by.id(baseSelector));
  } else {
    $p = isFirst() ? isChained() ? context.element(by.css(baseSelector)) : context(by.css(baseSelector)) : context.all(by.css(baseSelector));
  }

  if (atIndex >= 0) {
    $p = $p.get(atIndex);
  } else if (isLast()) {
    $p = $p.last();
  }

  $p = Proquery.prototype.extend($p, {
    context       : context,
    baseSelector  : baseSelector,
    psuedoSelector: psuedoSelector,
    isNgRepeat    : isNgRepeat,
    isIFrame      : isIFrame,
    atIndex       : atIndex,
    isId          : isId
  }, isProqueried ? 'FIND' : '');

  function isFirst() {
    return psuedoSelector === 'first';
  }

  function isLast() {
    return psuedoSelector === 'last';
  }

  function isChained() {
    return typeof context !== 'function';
  }

  return $p;
};

Proquery.prototype.extend = function($p, opts, action) {
  var opts = opts || {},
      length = function() {
        var len;
        try {
          len = $p.count().then(function(length) { return length; }, function() { return 0; });
        } catch(e) {
          try {
            len = $p.isPresent().then(function() { return 1; }, function() { return 0; });
          } catch(e) {
            // for browser.driver.switchTo().activeElement() call mostly
            len = $p.then(function() { return 1; }, function() { return 0; });
          }
        }
        return len;
      },
      val = function(value) {
        if (value === '' || !!value) {
          return this.clear() && this.sendKeys(value); 
        } else {
          return typeof this.each === 'function' ? this.getNative(0).getAttribute('value') : this.getAttribute('value');
        }
      },
      text = function() {
        return this.getText().then(function(text) { return typeof text === 'string' ? text : text.join(''); });
      },
      html = function() {
        return (typeof this.each === 'function' ? this.getNative(0) : this).getInnerHtml();
      },
      attr = function(attribute) {
        return typeof this.each === 'function' ? this.getNative(0).getAttribute(attribute) : this.getAttribute(attribute);
      },
      animate = function(properties) {
        return browser.actions().dragAndDrop(typeof this.each === 'function' ? this.first() : this, properties).perform();
      },
      is = function(check) {
        var $this = typeof this.each === 'function' ? this.first() : this;
        if (check === ':present') {
          return  $this.isPresent().then(function(isPresent) { return isPresent; }, function() { return false; });
        } else if (check === ':visible') {
          return  $this.isDisplayed().then(function(isVisible) { return isVisible; }, function() { return false; });
        } else if (check === ':checked') {
          return $this.isSelected();
        }
      },
      filter = function(fn) {
        return Proquery.prototype.extend(this.filterNative(fn), {}, 'FILTER');
      },
      eq = function(elementIndex) {
        if (typeof this.each === 'function' && elementIndex >= 0) {
          return this.filter(function(el, i) { 
            return i === elementIndex;
          }).first().getWebElement();
        } else if (elementIndex === 0) {
          return this.getWebElement();
        } else {
          return undefined;
        }
      },
      get = function(elementIndex) {
        var that;
        if (opts.isNgRepeat) {
          that = Proquery.prototype.extend(opts.context.all(this.locator().row(elementIndex)));
        } else {
          if (opts) opts.atIndex = elementIndex;
          that = Proquery.prototype.extend(this.getNative(elementIndex), opts, 'GET');
        }
        
        return that;
      },
      first = function() {
        return Proquery.prototype.extend(this.getNative(0), {}, 'FIRST');
      },
      last = function() {
        return Proquery.prototype.extend(this.getNative(-1), {}, 'FIRST');
      },
      end = function() {
        browser.driver.switchTo().defaultContent();
        return this;
      },
      contents = function() {
        var $that;

        if (typeof this.each === 'function') {
          opts.atIndex = 0;
          $that = this.first();
        } else {
          $that = this;
        }

        if (opts.isIFrame) {
          if (opts.isId) {
            browser.driver.switchTo().frame(browser.driver.findElement(protractor.By.id(opts.baseSelector)));
          } else {
            browser.driver.switchTo().frame(browser.driver.findElement(protractor.By.css(opts.baseSelector)));
          }
        } else if (opts.atIndex >= 0) {
          browser.driver.switchTo().frame(opts.atIndex);
        }
        
        // this is a first-timer dummy .find method for frames that uses Protractor `element`
        // instead of ptor instance because we have just switched to frame.
        ALL_FUNCTIONS.forEach(function(fname) {
          delete $that[fname];
        });
        $that.find = function(selector) {
          var self;
          self = Proquery.prototype.init.call(this, selector, element);
          return self;
        };
        $that.end = function() {
          browser.driver.switchTo().defaultContent();
          return this;
        };
        return $that;
      };


  // backup native methods before overriding
  $p.filterNative = $p.filter;
  $p.getNative = $p.get;
  $p.firstNative = $p.first;
  $p.lastNative = $p.last;

  // exports custom and overide native methods
  if (action === 'FIRST') {
    FIRST_FUNCTIONS.forEach(function(fname) {
      $p[fname] = eval(fname);
    });
  } else if (action === 'GET') {
    GET_FUNCTIONS.forEach(function(fname) {
      $p[fname] = eval(fname);
    });
  } else if (action === 'FILTER') {
    FILTER_FUNCTIONS.forEach(function(fname) {
      $p[fname] = eval(fname);
    });
  } else if (action === 'FIND') {
    FIND_FUNCTIONS.forEach(function(fname) {
      if (fname === 'find') {
        $p.find = Proquery.prototype.init;
      } else {
        $p[fname] = eval(fname);
      }
    });
  } else {
    ALL_FUNCTIONS.forEach(function(fname) {
      if (fname === 'find') {
        $p.find = Proquery.prototype.init;
      } else {
        $p[fname] = eval(fname);
      }
    });
  }

  $p.length = $p.length();

  return $p;
};

module.exports = Proquery;