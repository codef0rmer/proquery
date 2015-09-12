var $p = require('../../../index.js');

describe('using an ActionSequence', function() {
  beforeEach(function() {
    browser.get('index.html#/form');
  });

  it('should drag and drop', function() {
    // var sliderBar = element(by.name('points'));
    var $sliderBar = $p('[name="points"]');

    // expect(sliderBar.getAttribute('value')).toEqual('1');
    expect($sliderBar.attr('value')).toEqual('1');

    // browser.actions().dragAndDrop(sliderBar, {x: 400, y: 20}).perform();
    $sliderBar.animate({x: 400, y: 20});

    // expect(sliderBar.getAttribute('value')).toEqual('10');
    expect($sliderBar.attr('value')).toEqual('10');
  });
});

