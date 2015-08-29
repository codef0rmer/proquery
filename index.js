module.exports = function(selector) {
  var $p,
      baseSelector = selector.split(':')[0],
      psuedoSelector = selector.split(':')[1],
      isClass = baseSelector.indexOf('.') === 0,
      isBinding = !!baseSelector.match(/{{[A-Za-z0-9\.]+\}}/g),
      isNgModel = baseSelector.indexOf('[ng-model=') === 0,
      isId = baseSelector.indexOf('#') === 0;

  // skip . and # from CSS class and ID respectively
  if (isClass || isId) baseSelector = baseSelector.substr(1);

  // skip {{ }} from bindings
  if (isBinding) baseSelector = baseSelector.replace(/{|}/g, '');

  // skip "" or '' from ngModel
  if (isNgModel) baseSelector = baseSelector.split('"')[1] || selector.split('\'')[1];

  if (isBinding) {
    $p = element.all(by.binding(baseSelector));
  } else if (isNgModel) {
    $p = element.all(by.model(baseSelector));
  } else if (isId) {
    $p = element.all(by.id(baseSelector));
  } else {
    $p = element.all(by.css(baseSelector));
  }

  // For psuedo such username:first or username:last
  if (psuedoSelector === 'first') {
    $p = $p.first();
    $p.length = $p.isPresent().then(function() { return 1; }, function() { return 0; });
  } else if (psuedoSelector === 'last') {
    $p = $p.last();
    $p.length = $p.isPresent().then(function() { return 1; }, function() { return 0; });
  } else {
    $p.length = $p.count();
  }

  $p.find = function(selector) {
    var arrBindings = selector.match(/{{[A-Za-z0-9\.]+\}}/g);
    var $el = null;

    if (selector.indexOf('.') === 0) selector = selector.substr(1);
  
    if (!!arrBindings) {
      $el = element(by.binding(arrBindings[0].replace(/{|}/g, '')));
      $el.length = 1;
    } else {
      if (selector.indexOf('[ng-model=') === 0) {
        $el = this.element(by.model(selector.split('"')[1] || selector.split('\'')[1]));
        $el.length = 1;
      } else {
        $el = this.all(by.css(selector));
        $el.length = $el.count();
      }
      // if (selector.indexOf('.') === 0) selector = selector.substr(1);
      // $el = this.$(selector);
      // $el.length = 1;
    }
    // See if you can return a promise
    // $el.isPresent().then(function(isPresent) {
      $el.text = $p.text;
      $el.find = $p.find;
      // return $el.isPresent().then(function() { return $el; }, function() { return $el; });
      return $el;
    //   deferred.resolve();
    // }, function() {
    //   $el.length = 0;
    //   deferred.resolve();
    // });
  };

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
    return browser.actions().dragAndDrop(this, properties).perform();
  };

  return $p;
};