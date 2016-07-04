**Testing EventEmitters**

When testing event emitters, one can listen to the emitted event, read the values provided when the event is emitted and assert that they are what we expect. However, this is not the ideal way of testing event emitters. The emitter might be called multiple times with different values and we can only test the last invocation of the `emit` method.

One can instead setup `mocks` to act as event listeners and verify the expectations. You could have a mock that expects that the `emit` memthod is called with the correct expectation. A mock does not complain if a method does not exist on the original object that we are testing. So, it could cause false positives. Also, if something can emit multiple events, mocking the `emit` method means that all events have to be tested.If an event is omitted, an error is omitted.

It is usually better to listen to events rather than mocking an `emit` function. To express the order in which events occur, you can push the events into an array and check the order of the event at the end of the test. Having an explicit order in which events means that there is a hidden dependency in your code. It is good to model your code to avoid that. But for certain APIs, it is important. stream cannot emit `data` after it emits `end`.

Instead one can use `spies` to avoid registering listeners,  a spy does not setup any expectations before hand and the assertion occurs after the test has been called.
Thus it is responsible for replacing the function with a spy and recording the calls to the function.

---

**Testing Event handlers**

+ Running end-to-end for all cases on an event driven system is exhausting.

+ Consider event handlers to be functions that act as wiring between two parts of the system.

+ If the name of an event changes, your listeners will fail silently.

+ Push most of the edge cases to unit tests but have healthy integration tests.

+ Consider events that an object emits to be a part of it's public API, unit test to check that the events are emitted when object changes.

The author proposes an alternate event system called a Listenable based on the fact that if a method on an object changes, it throws an error.
Listenables accept an object and setup events as properties on the object. This provides tighter coupling between events and the object that emits the events.

---

**Testing Streams**

What we will be testing:

1. checking the output of the reaadable stream

2. check the effect of a transform stream

There are three ways of getting data out of a readable stream:

1. `pipe` to a writable stream

2. subscribe to the `data` and `end` events

In both of the above cases, the stream goes into a `flowing` mode and pushes data automatically

3. `read` can be used to pull a certain number of `bytes` from a stream.

To test a stream, either use the `data` event if you want to test how the chunks are divided. If you are interested only in testing the output of the readable stream, concat the output of the readable stream using `concat-stream` and test that.

A transform stream is both a readable and a writable stream that performs a transformation on the data before emitting it out. A `transform stream`'s has an `_transform` method which lets us know when it is done. If we know that `push` will invoke once or not at all, we can mock the transform stream's `push` method and invoke the stream's `_transform` method.

If not it is better to use the approaches described above.

Streams have the advantage that they can be written to do only thing and then be combined to do larger units of work. This makes them easier to use and easy to test because you can test one thing without having to worry about having to test a side-effect also.

From doing the examples, it has finally got through into my thick head that there is no clever way of unit testing nodejs streams. We can only test a stream by calling it. At this moment, I do not know if that is a good or a bad thing because `stream`s can be infinite and can be chained together ad infinitum. At some point, we have to figure out what we can do to accomplish

---
