A unit testing framework is a program that tests your program for correctness and checks to see if it fails any of the cases provided. Some frameworks provide an assertion method that puts the actual value before the expected value and others do the opposite:

```
function add(a,b) {
  return a + b
}

assertEqual(4,add(2,2),'Failed to add two numbers')
```

The course uses the `jstest` framework written by the author himself. `jstest` can detect the platform that it is running on
Keeping tests in a seperate file makes them easier to run.

Assertions are statements that check that the:

  + output of a function

  + state of the application are correct

`assert` statements do nothing if something is truthy, they throw an error if something is falsy.

**assert: Node.js core module**

  |Function|Behaviour|
  |:------:|:-------:|
  |assert.equal(actual,expected)|use `==` to do equality check|
  |assert.notEqual(actual,expected)|use `!=` to do inequality check|
  |assert.strictEqual(actual,expected)|use `===` to do equality check|
  |assert.notStrictEqual(actual,expected)|use `!==` to compare values|
  |assert.deepEqual(actual,expected)|recursive equality check for objects, arrays|
  |assert.notDeepEqual(actual,expected)|recursively checks inequality|

`assert.deepEqual` also works with other reference types such as:

  + regular expressions with exact same source flags are considered equal

  + `Date` objects representing the same time are considered equal

  + Node `Buffer`s with the same bytes and length

> IDK much about buffers but I understand that they are a custom type used by Node to represent binary data(??), JS browsers use `Blobs` and `ArrayBuffers`(??)

In addition, it also checks the behaviour of `strictEqual` as well as `equal` on primitives.

> I read an article by Eric Elliot who recommends using `deepEqual` as the only `assertion` you ever use.

---

**Jasmine Matchers**

Jasmine uses `expect` syntax but it's concept of `deepEquality` is different from the one we saw above.

    expect(a).toEqual(b)
    expect(a).not.toEqual(b)

The two methods are `deepEqual` and `notDeepEqual` methods, for `strict equality`, replace `toEqual` with `toBe`.

> Chai is more `English-like` with `chaining helpers` that do nothing. QUnit is more minimal, just uses `assertions` as top level functions.

---

The `jstest` assertions:

> I will do the truthy ones, you can add `NotSame` instead of `Same` and so on
  |Function|Behaviour|
  |:------:|:-------:|
  |assertSame|`===`|
  |assertEqual|deep equality with caveats|
  |assertThrow|check that an `Error` was thrown|
  |assertNothingThrown|check that no `Error` was thrown|

`jstest` uses the `equals` method on `expected`(if it exists) to determine if two things are equal, it does not perform equality checks on `buffers`


---

Picking an `assertion` style is a matter of choice, if you cannot read your tests and you cannot write new tests, assertions or new matchers easily, it is not meaningful to do unit testing in the first place. It does not `reduce risk` of program failing in production.

---

`with` is a Javascript feature that makes the `properties` of an `object` look like `local variables`. It saves you from `prefixing` every statement with `this` .

What is `with` and why the author uses it?

Jasmine and mocha introduce global variables like `describe`,`it` and `expect`. The testing framework coexists in the same environment as the javascript code. Thus, the author uses a single variable called `JSTest` and binds everything including assertions and any values to `this`.

As we know, functions have a scope(and now blocks have a scope in ES6) and closures look up variables in parent scopes. One can think of a scope as an object that has variable names as keys and their current value as the value for the property.`with` takes an object and creates a new scope,exposing all the properties on the object as
variables within the scope.

`with` is generally considered a bad practice in Javascript, it makes it unclear if something is a variable scoped to a function or something that exists only in the scope created by `with`. Additionally, `with` is not available in `strict mode`.


---

An `it` block represents a `test`, this allows the `testing framework` to isolate or skip your test when nessecary.

In `jstest`, use the `TEST` environment variable to run `tests` which include the specific string.

> this is a little wierd, there has to be a method to isolate `individual tests`, there is something like that in `mocha` and `jasmine`(??)

Grouping tests also gives us the ability to `setup` and `teardown` state before and after any test. The `jstest` framework uses `before` and `after`, mocha and jasmine offer `beforeEach` and `afterEach`, `tape` offers `setup` and `teardown`.

It is advisable to store state on `this`, if and only if the `test framework` offers a new context for each test. `jasmine` does that, but `mocha` not. Should a `testing framework` modify the value of `this` in Javascript?

Tests cannot leave state behind, this will break other tests in unpredictable ways. If you write to the DOM, remove the nodes, if you put data into localstorage,delete it. If you start a server, shut it down.

Nested `describe` blocks: an `it` runs after all the `before` blocks in all enclosing `describe` blocks are run, once the `test` finishes, all the `after` blocks in all `enclosing describe` blocks are run. Nested describe blocks are generally a good idea as long as you dont nest too deep or share state between tests, making modifications with the `before` statement of a nested describe block.

---

**Stubs, Mocks and Spies**

1. Stubs

You would not like to have the test make a call to the server or the database when it runs, this might the test slow and/or unreliable. To avoid doing this, we can replace certain functions with a fake implementation that is active only for the duration of the test. As the system under test becomes more complex, you would need to add more fakes to the mix and clean up in the `afterEach` block.

Also, you might need to have different responses based on the input you provide to the function/method that you stub. Testing frameworks or libraries like `sinon` can do this automagically.`jstest` implicitly resets all stubs at the end of a test, if I were using `sinon`, I would need to call the `restore` method in `afterEach`Stubs have a `yields` method that makes a function invoke its callback with the parameters passed to it. If the function we are stubbing returns a value, you call it with `returns` instead of `yields`.

You can get a `stub` to provide different responses when different arguments are provided to it:

    stub($, "get").given("/").yields(["Homepage HTML"])
    stub($, "get").given("/users/18787.json").yields(['{"username":"jcoglan"}'])

Sinonjs uses `withArgs` in place of `given` provided by `jstest`. In `jstest`, stubs use `equals` on the arguments passed to it if `given` is provided. Stubs can use `matchers` in `given`:

  |Matcher|Description|
  |:-----:|:---------:|
  |anything|matches any value|
  |instanceof|matches a value of type|
  |arrayIncluding|matches if a array includes members|
  |objectIncludes|matches object if it contains properties|
  |match|match a custom RegExp|

When using `yields` with `given` args are matched upto a function's callback.

2. Mocks

Mocks are used to test side-effects, the question with a stub is:

> If this function were to return this, what would my function do?

with a mock:

> What functions does my function call and how does it call them?

Use mocks when there is a well defined boundary between two APIs, the API you are mocking is stable and well understood. A mock needs to be setup to record any calls to the function along with certain expectations before the function we are testing is called. If the expectations of the mock are not satisfied, the test is considered a failure. Mocks can also use `yields` and `returns` to verify the arguments passed to the callback or returned from a function.

> Assertions --> test value returned by function, Stubs -> create various test responses from an external API that the function calls, Mocks -> check to see that external API is called correctly.

3. Spies

A spy inspects the behaviour of an existing function without replacing it. When mocking, you replace an external API method with a fake. However, when `spy`ing, you let the original function execute. If an API is not well defined or well understood, it is better to let the original function through instead of replacing it with a `mock`.

In `jstest`, mocks are defined using `expect`, usually `expect` is used with `BDD` style assertions in other frameworks. The `jstest` framework does not define `spies`, we use sinon spies for a change.

---

**Testing async behaviour**

This section in the book is about letting async behaviour go through and executing assertions in a `callback`. The author recommends executing `assertions` inside the `done` callback. I need to figure out `mocha`'s recommendations/best practices on that. Both the `resume` function provided here and `mocha`'s `done` are error-first callbacks.

Sinon has fakeTimers(?) and mocha allows returning promises from tests.

There is a good explanation of using `async` in there as well, need to do the examples and expand this out.

When testing something asynchronously, the testing frssmework cannot capture the stack trace using try/catch like it normally would. Instead it has to rely on `window.onerror` or process.on('uncaughtException',cb) to perform error reporting. If the assertion is run in a callback passed to the resume function, it is run synchronously and any error with the assertion can be reported correctly.If a test has the `resume` as an argument, jstest waits for the test to call `resume` and times the test out and reports an error if callback is not invoked.

> If a framework has no support for `async` testing, it might cause the test to hang or time out. I think all major frameworks including Jasmine support this.

`resume` follows the error first callback convention, if the first argument to `resume` is a `String` or an `Object`, it is reported as an error.

To avoid wrapping your entire code in a single `it` block, create `helper` module to start and stop the server, there is an `include` in the jstest api, I presume this is mixin. Wierd for a test framework to keep changing `this` so much, but what do I know.

Could this `helper` module use `supertest` for a better experience(???)

One can use `async` to great effect when working with callbacks, it makes the continous passing style tolerable as it takes care of managing intermediate values and errors in a chain of callbacks. Continuables or curried functions whose last parameter is a callback work exceptionally well with `async`. Continuables can created using the curry module on npm.

> To test any async control flow construct, you need to use a library that understands that construct.

Continuables are functions that seperate the processing of application logic and control flow logic, this is done by partially applying a function that accepts a callback to return a new function that accepts the callback and processes the result/error. Continuables are like promises but without the `nice API`, `stack traces` or `error handling`.

---

Mini rant

All the `assertions` are available on `this` within the `describe` block, these assertions have been moved to `ServerSteps` which means that the module must be bound to the same `this` as the `describe` block. So, it is included as a mixin(presumably). But callbacks are executed by `async` in a different `context` where `this` could either be `global`,`undefined` or `async`. So we do `self=this`, and I hate that statement.

This makes the case for using an assertion library seperate from the `testing framework`, so either use `chai` or `assert` when  `unit tedting`. And I hate `this`.

End of rant

---

> Export `app` from your code and create your server elsewhere, this will allow you to spin up servers programmatically for testing/different environment. Thats why express-generator uses `bin/www`, I guess.

---
