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
var $ = require('proquery');
```
As per Protractor API, `$` matches a single element, however, Proquery's `$` matches multiple elements by default. For the old behavior use:
```sh
$ $('.menu', true).getTagName())
```
The second parameter is `useOriginal` and will match a single element instead.


| Proquery Selectors                                        | Protractor Selectors
| --------------------------------------------------------- | ----------------------------------------------------------------------------
| $('iframe').length                                        | element.all(by.css('iframe')).count() 
| $('[type="text"]')                                        | element.all(by.css('[type="text"]')) 
| $('textarea')                                             | element.all(by.css('textarea')) 
| $('.menu')                                                | element.all(by.css('.menu')) 
| $('#checkboxes')                                          | element.all(by.id('checkboxes')) 
| $('[ng-model="username"]')                                | element.all(by.model('username')) 
| $('{{username}}')                                         | element.all(by.binding('username')) 
| $('[ng-repeat="baz in days"]')                            | element.all(by.repeater('baz in days')) 
| $('[ng-options="fruit for fruit in fruits"]')             | element.all(by.options('fruit for fruit in fruits')) 
| $('#animals ul .pet')                                     | element.all(by.cssContainingText('#animals ul .pet')) 
| $('[type="text"]:first')                                  | element.all(by.css('[type="text"]')).first() 
| $('[type="text"]:last')                                   | element.all(by.css('[type="text"]')).last() 
| $('a:contains("repeater")')                               | element.all(by.partialLinkText('repeater')) 
| $('button:contains("text")')                              | element.all(by.partialButtonText('text')) 
| $('#animals ul .pet:contains("dog")')                     | element.all(by.cssContainingText('#animals ul .pet', 'dog')) 
| $('[ng-model="fruit"]').find('option')                    | element.all(by.model('fruit')).all(by.css('option') 
| $('[ng-model="fruit"]').find('option:checked')            | element.all(by.model('fruit')).all(by.css('option:checked') 
| $(':focus')                                               | browser.driver.switchTo().activeElement() 
| $('[class="pet"]').attr('value')                          | element.all(by.css('[class="pet"]')).first().getAttribute('value') 
| $('[class="pet"]:first').val()                            | element(by.css('[class="pet"]')).getAttribute('value') 
| $('[type="text"]:first').val('')                          | element(by.css('[type="text"]')).clear() 
| $('[type="text"]:first').val('codef0rmer')                | element(by.css('[type="text"]')).sendKeys('codef0rmer') 
| $('[class="pet"]:first').text()                           | element(by.css('[class="pet"]')).getText() 
| $('[class="pet"]:first').html()                           | element(by.css('[class="pet"]')).first().getInnerHtml() 
| $('body').find('[class="pet"]')                           | element.all(by.css('body')).all(by.css('[class="pet"]')) 
| $('[class="pet"]').get(0)                                 | element.all(by.css('[class="pet"]')).get(0) 
| $('[class="pet"]:eq(0)')                                  | element.all('[class="pet"]').get(0).getWebElement()
| $('[ng-repeat="baz in days"]').get(0)                     | element(by.repeater('baz in days').row(0)) 
| $('[ng-repeat="baz in days"]').get(0).find('baz.initial') | element(by.repeater('baz in days').row(0).column('baz.initial')) 
| $('[ng-repeat="baz in days"]').find('baz.initial')        | element.all(by.repeater('baz in days').column('baz.initial')) 
| $('[ng-repeat="baz in days"]').find('baz.initial').get(1) | element.all(by.repeater('baz in days').column('baz.initial').row(1)) 
| $('#checkboxes:first').is(':present')                     | element(by.id('checkboxes')).isPresent() 
| $('#checkboxes:first').is(':visible')                     | element(by.id('checkboxes')).isDisplayed() 
| $('#checkboxes:first').is(':enabled')                     | element(by.id('checkboxes')).isEnabled() 
| $('#checkboxes:first').is(':checked')                     | element(by.id('checkboxes')).isSelected() 
| $('{{greeting}}').eq(0)                                   | element.all(by.binding('greeting')).get(0).getWebElement()
| var $el = $('iframe').contents().find('#checkboxes');     | browser.driver.switchTo().frame(0);
|     expect($el.is(':present')).toBeTruthy();              |     expect(element(by.id('checkboxes')).isPresent()).toBeTruthy();
|     $el.end();                                            |     browser.driver.switchTo().defaultContent();

## Todos
- [ ] Support for .switchTo() popup windows
- [ ] Support by.exactBinding and by.buttonText to map exact text instead of partial
- [ ] Find a jQuery-like API for .switchTo().alert()
- [ ] Support KEYS using .trigger method e.g. .trigger('enter') over .sendKeys(protractor.Key.ENTER)
- [ ] Support complex selectors such as $('body div:last span:eq(2) a:contains("Link")')

## Differences with jQuery
 * .length returns promise instead of number unlike jQuery
 * .get returns matched element instead of element reference a.k.a webElement unlike jQuery
 * .eq returns element reference a.k.a webElement instead of matched element unlike jQuery