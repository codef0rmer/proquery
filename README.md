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

| Proquery Selectors                                         | Protractor Selectors
| ---------------------------------------------------------- | ----------------------------------------------------------------------------
| $p('iframe').length                                        | element.all(by.css('iframe')).count() 
| $p('[type="text"]')                                        | element.all(by.css('[type="text"]')) 
| $p('textarea')                                             | element.all(by.css('textarea')) 
| $p('.menu')                                                | element.all(by.css('.menu')) 
| $p('#checkboxes')                                          | element.all(by.id('checkboxes')) 
| $p('[ng-model="username"]')                                | element.all(by.model('username')) 
| $p('{{username}}')                                         | element.all(by.binding('username')) 
| $p('[ng-repeat="baz in days"]')                            | element.all(by.repeater('baz in days')) 
| $p('[ng-options="fruit for fruit in fruits"]')             | element.all(by.options('fruit for fruit in fruits')) 
| $p('#animals ul .pet')                                     | element.all(by.cssContainingText('#animals ul .pet')) 
| $p('[type="text"]:first')                                  | element.all(by.css('[type="text"]')).first() 
| $p('[type="text"]:last')                                   | element.all(by.css('[type="text"]')).last() 
| $p('a:contains("repeater")')                               | element.all(by.partialLinkText('repeater')) 
| $p('button:contains("text")')                              | element.all(by.partialButtonText('text')) 
| $p('#animals ul .pet:contains("dog")')                     | element.all(by.cssContainingText('#animals ul .pet', 'dog')) 
| $p('[ng-model="fruit"]').find('option')                    | element.all(by.model('fruit')).all(by.css('option') 
| $p('[ng-model="fruit"]').find('option:checked')            | element.all(by.model('fruit')).all(by.css('option:checked') 
| $p(':focus')                                               | browser.driver.switchTo().activeElement() 
| $p('[class="pet"]').attr('value')                          | element.all(by.css('[class="pet"]')).first().getAttribute('value') 
| $p('[class="pet"]:first').val()                            | element(by.css('[class="pet"]')).getAttribute('value') 
| $p('[type="text"]:first').val('')                          | element(by.css('[type="text"]')).clear() 
| $p('[type="text"]:first').val('codef0rmer')                | element(by.css('[type="text"]')).sendKeys('codef0rmer') 
| $p('[class="pet"]:first').text()                           | element(by.css('[class="pet"]')).getText() 
| $p('[class="pet"]:first').html()                           | element(by.css('[class="pet"]')).first().getInnerHtml() 
| $p('body').find('[class="pet"]')                           | element.all(by.css('body')).all(by.css('[class="pet"]')) 
| $p('[class="pet"]').get(0)                                 | element.all(by.css('[class="pet"]')).get(0) 
| $p('[class="pet"]:eq(0)')                                  | element.all('[class="pet"]').get(0).getWebElement()
| $p('[ng-repeat="baz in days"]').get(0)                     | element(by.repeater('baz in days').row(0)) 
| $p('[ng-repeat="baz in days"]').get(0).find('baz.initial') | element(by.repeater('baz in days').row(0).column('baz.initial')) 
| $p('[ng-repeat="baz in days"]').find('baz.initial')        | element.all(by.repeater('baz in days').column('baz.initial')) 
| $p('[ng-repeat="baz in days"]').find('baz.initial').get(1) | element.all(by.repeater('baz in days').column('baz.initial').row(1)) 
| $p('#checkboxes:first').is(':present')                     | element(by.id('checkboxes')).isPresent() 
| $p('#checkboxes:first').is(':visible')                     | element(by.id('checkboxes')).isDisplayed() 
| $p('#checkboxes:first').is(':checked')                     | element(by.id('checkboxes')).isSelected() 
| $p('{{greeting}}').eq(0)                                   | element.all(by.binding('greeting')).get(0).getWebElement() 

## Todos
- [ ] Support for .switchTo() popup windows
- [ ] Support by.exactBinding and by.buttonText to map exact text instead of partial
- [ ] Find a jQuery-like API for .switchTo().alert()
- [ ] Support KEYS using .trigger method e.g. .trigger('enter') over .sendKeys(protractor.Key.ENTER)
- [ ] Support complex selectors such as $p('body div:last span:eq(2) a:contains("Link")')

## Differences with jQuery
 * .length returns promise instead of number unlike jQuery
 * .get returns matched element instead of element reference a.k.a webElement unlike jQuery
 * .eq returns element reference a.k.a webElement instead of matched element unlike jQuery