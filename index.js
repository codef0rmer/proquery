module.exports = function(selector) {
  var init = function(selector, context) {
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

    // For psuedo such username:first or username:last
    if (psuedoSelector === 'first') {
      $p = $p.first();
      $p.length = $p.isPresent().then(function() { return 1; }, function() { return 0; });
    } else if (psuedoSelector === 'last') {
      $p = $p.last();
      $p.length = $p.isPresent().then(function() { return 1; }, function() { return 0; });
    } else {
      $p.length = $p.count().then(function(length) { return length; }, function() { return 0; });
    }

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

    $p.attr = function(attribute) {
      return typeof this.each === 'function' ? this.first().getAttribute(attribute) : this.getAttribute(attribute);
    };

    $p.animate = function(properties) {
      return browser.actions().dragAndDrop(typeof this.each === 'function' ? this.first() : this, properties).perform();
    };

    $p.is = function(check) {
      if (check === ':visible') {
        return this.isPresent().then(function() { return true; }, function() { return false; });
      } else if (check === ':checked') {
        return typeof this.each === 'function' ? this.first().isSelected() : this.isSelected();
      }
    };

    $p.filterNative = $p.filter;
    $p.filter = function(fn) {
      var filtered = this.filterNative(fn);
      filtered.length = filtered.count().then(function(length) { return length; }, function() { return 0; });
      return filtered;
    };

    $p.eq = function(elementIndex) {
      if (typeof this.each === 'function') {
        return this.filter(function(el, i) { 
          return i === elementIndex;
        }).getWebElement();
      } else if (elementIndex === 0) {
        return this.getWebElement();
      } else {
        return undefined;
      }
    };

    $p.find = init;
    
    return $p;
  };

  return init(selector, element);
};