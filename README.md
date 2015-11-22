# Proquery
[![Circle CI](https://img.shields.io/circleci/project/codef0rmer/proquery/master.svg)](https://circleci.com/gh/codef0rmer/proquery)
[![npm](https://img.shields.io/npm/dm/proquery.svg)](https://www.npmjs.com/package/proquery)

The goal of this project is to help writing Integration Tests faster than ever. As everybody is pretty familiar with jQuery and it's nifty selectors for querying DOM, I decided to use jQuery approach to query elements wihout using Protractor Jargons. If you think in jQuery, you do not even have to groak Proquery API :-)

## Prior Art
https://github.com/angular/protractor/issues/397

## Development
Resolve NPM and Bower depedencies,
```sh
$ npm install
$ bower install
```

## Testing
To run tests against Protractor testapp:
```sh
$ webdriver-manager start
$ git clone https://github.com/angular/protractor.git
$ cd protractor/
$ npm start
```

To execute end-to-end tests on a specific browser, use:
```sh
$ git clone https://github.com/codef0rmer/proquery.git
$ cd proquery/
$ npm start
$ npm test
```

## API Docs

Refer tests/spec.js or tests/protractor_tests/ for more help.

```sh
$ npm install -g proquery

```

```js
var $p = require('proquery');
```

| Proquery Selector     | Protractor Selector | Description
| --------------------- | ------------------- | ------------------
| $p('iframe').length | element.all(by.css('iframe')).count() | count elements
| $p('[type="text"]') | element.all(by.css('[type="text"]')) | find elements by attribute
| $p('textarea') | element.all(by.css('textarea')) | find elements by tag name
| $p('.menu') | element.all(by.css('.menu')) | find elements by class name
| $p('#checkboxes') | element.all(by.id('checkboxes')) | find elements by id
| $p('[ng-model="username"]') | element.all(by.model('username')) | find elements by ngModel
| $p('{{username}}') | element.all(by.binding('username')) | find elements by binding
| $p('[ng-repeat="baz in days"]') | element.all(by.repeater('baz in days')) | find elements by ngRepeat
| $p('[ng-options="fruit for fruit in fruits"]') | element.all(by.options('fruit for fruit in fruits')) | find elements by ngOptions
| $p('#animals ul .pet') | element.all(by.cssContainingText('#animals ul .pet')) | light-weight nested selectors (space separated)
| $p('[type="text"]:first') | element.all(by.css('[type="text"]')).first() | find first matched element
| $p('[type="text"]:last') | element.all(by.css('[type="text"]')).last() | find last matched element
| $p('a:contains("repeater")') | element.all(by.partialLinkText('repeater')) | find anchor elements by anchor text
| $p('button:contains("text")') | element.all(by.partialButtonText('text')) | find button elements by button text
| $p('#animals ul .pet:contains("dog")') | element.all(by.cssContainingText('#animals ul .pet', 'dog')) | find elements by text with nested selector
| $p('[ng-model="fruit"]').find('option') | element.all(by.model('fruit')).all(by.css('option') | find options of select element 
| $p('[ng-model="fruit"]').find('option:checked') | element.all(by.model('fruit')).all(by.css('option:checked') |find selected option of select element
| $p(':focus') | browser.driver.switchTo().activeElement() | find active/focused element
| $p('[class="pet"]').attr('value') | element.all(by.css('[class="pet"]')).first().getAttribute('value') | get attribute value
| $p('[class="pet"]:first').val() | element(by.css('[class="pet"]')).getAttribute('value') | get input value
| $p('[type="text"]:first').val('') | element(by.css('[type="text"]')).clear() | clear input
| $p('[type="text"]:first').val('codef0rmer') | element(by.css('[type="text"]')).sendKeys('codef0rmer') | set input value 
| $p('[class="pet"]:first').text() | element(by.css('[class="pet"]')).getText() | get innerText of elements
| $p('[class="pet"]:first').html() | element(by.css('[class="pet"]')).first().getInnerHtml() | get innerHTML of elements
| $p('body').find('[class="pet"]') | element.all(by.css('body')).all(by.css('[class="pet"]')) | find child elements
| $p('[class="pet"]').get(0) | element.all(by.css('[class="pet"]')).get(0) | get element by index
| $p('[class="pet"]:eq(0)') | $p('[class="pet"]').get(0) | get element by index (alternative to .get)
| $p('[ng-repeat="baz in days"]').get(0) | element(by.repeater('baz in days').row(0)) | find row of ngRepeat
| $p('[ng-repeat="baz in days"]').get(0).find('baz.initial') | element(by.repeater('baz in days').row(0).column('baz.initial')) | find row and then column of ngRepeat
| $p('[ng-repeat="baz in days"]').find('baz.initial') | element.all(by.repeater('baz in days').column('baz.initial')) | find column of ngRepeat
| $p('[ng-repeat="baz in days"]').find('baz.initial').get(1) | element.all(by.repeater('baz in days').column('baz.initial').row(1)) | find column and then row of ngRepeat
| $p('#checkboxes:first').is(':present') | element(by.id('checkboxes')).isPresent() | check if element is present in DOM
| $p('#checkboxes:first').is(':visible') | element(by.id('checkboxes')).isDisplayed() | check if element is visible in DOM
| $p('#checkboxes:first').is(':checked') | element(by.id('checkboxes')).isSelected() | check if element is checked
| $p('{{greeting}}:first').eq(0) | element(by.binding('greeting')).getWebElement() | get hold of element reference


## Todos
- [ ] Support for .switchTo() popup windows
- [ ] Support by.exactBinding and by.buttonText to map exact text instead of partial
- [ ] Find a jQuery-like API for .switchTo().alert()
- [ ] Support KEYS using .trigger method e.g. .trigger('enter') over .sendKeys(protractor.Key.ENTER)