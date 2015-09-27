module.exports = function(selector) {
  var init = function(selector, context) {
    if (typeof selector === 'object') return exposePublicAPIs(selector);

    var $p,
        baseSelector    = selector.replace(/:first|:last$/, ''),
        psuedoSelector  = (selector.match(/:first|:last$/) || [""])[0].substr(1),
        isLinkFilter    = baseSelector.indexOf('a:contains') === 0,
        isButtonFilter  = baseSelector.indexOf('button:contains') === 0,
        isClass         = baseSelector.indexOf('.') === 0,
        isBinding       = !!baseSelector.match(/{{[A-Za-z0-9\.\|_]+\}}/g),
        isNgModel       = baseSelector.indexOf('[ng-model=') === 0,
        isNgRepeat      = baseSelector.indexOf('[ng-repeat=') === 0,
        isId            = baseSelector.indexOf('#') === 0,
        context         = context || this;

    // :contains() for links and buttons
    if (isLinkFilter || isButtonFilter) baseSelector = ( baseSelector.match(/:contains\((.*)+\)/)[1] || '').replace(/'/g, '').replace(/"/g, '');

    // skip # from ID
    if (isId) baseSelector = baseSelector.substr(1);

    // skip {{ }} from bindings
    if (isBinding) baseSelector = baseSelector.replace(/{|}/g, '');

    // skip "" or '' from ngModel
    if (isNgModel || isNgRepeat) baseSelector = baseSelector.split('"')[1] || selector.split('\'')[1];

    if (context.locator && context.locator().toString().indexOf('by.repeater') >= 0) {
      $p = element.all(context.locator().column(baseSelector));
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
    } else if (isId) {
      $p = context.all(by.id(baseSelector));
    } else {
      $p = context.all(by.css(baseSelector));
    }

    return exposePublicAPIs($p, psuedoSelector, {context: context, isNgRepeat: isNgRepeat});
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
        $p.length = $p.isPresent().then(function() { return 1; }, function() { return 0; });
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
      if (opts && opts.isNgRepeat) {
        return exposePublicAPIs(opts.context.all(this.locator().row(elementIndex)));
      } else {
        return exposePublicAPIs(this.getNative(elementIndex));
      }
    };

    $p.first = function() {
      return exposePublicAPIs(this.getNative(0));
    };

    $p.last = function() {
      return exposePublicAPIs(this.getNative(-1));
    };

    $p.find = init;

    return $p;
  };

  return init(selector, element);
};