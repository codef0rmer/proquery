module.exports = function(selector) {
  var $p,
      arrBindings = selector.match(/{{[A-Za-z0-9]+\}}/g);

  if (!!arrBindings) {
    $p = element(by.binding(arrBindings[0].replace(/{|}/g, '')));
  } else {
    $p = $(selector);
  }

  $p.val = function(value) {
    return value ? this.sendKeys(value) : !!arrBindings ? this.getText() : this.getAttribute('value');
  };

  return $p;
};