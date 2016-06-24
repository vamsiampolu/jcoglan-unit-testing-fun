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

`with` is a Javascript feature that makes the `properties` of an `object` look like `local variables`. It saves you from `prefixing` every statement with `this` .

> I tested the code without `with`, instead using `this.assertEquals` and it works correctly, `Mr. Crockford` approves

An `it` block represents a `test`, this allows the `testing framework` to isolate or skip your test when nessecary.

In `jstest`, use the `TEST` environment variable to run `tests` which include the specific string.

> this is a little wierd, there has to be a method to isolate `individual tests`, there is something like that in `mocha` and `jasmine`(??)

Grouping tests also gives us the ability to `setup` and `teardown` state before and after any test. The `jstest` framework uses `before` and `after`, mocha and jasmine offer `beforeEach` and `afterEach`, `tape` offers `setup` and `teardown`.

It is advisable to store state on `this`, if and only if the `test framework` offers a new context for each test. `jasmine` does that, but `mocha` not. Should a `testing framework` modify the value of `this` in Javascript?

Tests cannot leave state behind, this will break other tests in unpredictable ways. If you write to the DOM, remove the nodes, if you put data into localstorage,delete it. If you start a server, shut it down.

Nested `describe` blocks: an `it` runs after all the `before` blocks in all enclosing `describe` blocks are run, once the `test` finishes, all the `after` blocks in all `enclosing describe` blocks are run. Nested describe blocks are generally a good idea as long as you dont nest too deep or share state between tests, making modifications with the `before` statement of a nested describe block.

---

**Stubs, Mocks and Spies**

You would not like to have the test make a call to the server or the database when it runs, this might the test slow and/or unreliable. To avoid doing this, we can replace certain functions with a fake implementation that is active only for the duration of the test. As the system under test becomes more complex, you would need to add more fakes to the mix and clean up in the `afterEach` block.

Also, you might need to have different responses based on the input you provide to the function/method that you stub. Testing frameworks or libraries like `sinon` can do this automagically.`jstest` implicitly resets all stubs at the end of a test, if I were using `sinon`, I would need to call the `restore` method in `afterEach`Stubs have a `yields` method that makes a function invoke its callback with the parameters passed to it.
