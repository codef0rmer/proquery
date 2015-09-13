module.exports = function(selector) {
  var init = function(selector, context) {
    if (typeof selector === 'object') return exposePublicAPIs(selector);

    var $p,
        baseSelector = selector.split(':')[0],
        psuedoSelector = selector.split(':')[1],
        isClass = baseSelector.indexOf('.') === 0,
        isBinding = !!baseSelector.match(/{{[A-Za-z0-9\.]+\}}/g),
        isNgModel = baseSelector.indexOf('[ng-model=') === 0,
        isId = baseSelector.indexOf('#') === 0,
        context = context || this;

    // skip . and # from CSS class and ID respectively
    if (isClass || isId) baseSelector = baseSelector.substr(1);

    // skip {{ }} from bindings
    if (isBinding) baseSelector = baseSelector.replace(/{|}/g, '');

    // skip "" or '' from ngModel
    if (isNgModel) baseSelector = baseSelector.split('"')[1] || selector.split('\'')[1];

    if (isBinding) {
      $p = context.all(by.binding(baseSelector));
    } else if (isNgModel) {
      $p = context.all(by.model(baseSelector));
    } else if (isId) {
      $p = context.all(by.id(baseSelector));
    } else {
      $p = context.all(by.css(baseSelector));
    }

    return exposePublicAPIs($p, psuedoSelector);
  };

  var exposePublicAPIs = function($p, psuedoSelector) {
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
        return typeof this.each === 'function' ? this.first().getAttribute('value') : this.getAttribute('value');
      }
    };

    $p.text = function() {
      return this.getText().then(function(text) { return typeof text === 'string' ? text : text.join(''); });
    };

    $p.html = function() {
      var $this = typeof this.each === 'function' ? this.first() : this;
      return $this.getInnerHtml().then(function(html) { return html; });
    };

    $p.attr = function(attribute) {
      return typeof this.each === 'function' ? this.first().getAttribute(attribute) : this.getAttribute(attribute);
    };

    $p.animate = function(properties) {
      return browser.actions().dragAndDrop(typeof this.each === 'function' ? this.first() : this, properties).perform();
    };

    $p.is = function(check) {
      var $this = typeof this.each === 'function' ? this.first() : this;
      if (check === ':visible') {
        return  $this.isPresent().then(function(isVisible) { return isVisible; }, function() { return false; });
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
      return exposePublicAPIs(this.getNative(elementIndex));
    };

    $p.first = function() {
      return exposePublicAPIs(this.firstNative());
    };

    $p.last = function() {
      return exposePublicAPIs(this.lastNative());
    };

    $p.find = init;

    return $p;
  };

  return init(selector, element);
};