
# Utilities

## application()

The `application` function can be explained by using four different functions: `a`, `b`,  `c` and `d`.
```
a = application;
b = function(x,y,z){return [x,y,z]};
c = a(b, 1);
d = c(2);
e = d(3);
```
In this example: `e` should end up with the value `[1,2,3]`.

The `application` function (`a` in the example above) returns a function (`c`) which can be called to return a function (`d`) which can be called to call the function that was passed as the first argument of the `application` function (`b`) with all arguments from the `application` call other than the first argument, and all arguments from `c` and `d` calls combined.

### Example usage

An easy example that anyone can use is with the `console.log` function:

**Creating a logger:**
```
var logger = application(console, 'log')
	||	application(console, console.log)
	||	application(console)('log')
	||	application(console)(console.log)
	||	application.call(console, 'log')
	||	application.call(console, console.log)
	||	application.call(console)('log')
	||	application.call(console)(console.log)
```
And because the `console.log` function doesn't use the `this` in it's logic we can also do this:
```
var logger = application(console.log);
```
**Using the logger:**
Now we can use the `logger` function to create functions that log something using the `console.log` function:
```
var Sam_says = logger('Sam:');
Sam_says('Hello');
// Console logs => Sam: Hello
```

## llac()

This function is called `llac` or `call-back`.

`llac()` returns a function that when called triggers a list of callbacks to be called with the same arguments as the original function call.

`llac().listen` is a function that can be used to add or remove a function to and from the list of functions that will be called when the function returned from `llac()` is called.

The `llac().listen` function returns itself as the result. This means you can chain multiple execution calls together to add multiple functions to the list of callbacks or remove them from the list.

### Common Uses

This `llac` function is useful when working with callback functions.
```
function waitThen(seconds){
	var callback = llac();
	setTimeout(callback, (typeof seconds == 'number'?seconds:1)*1000);
	return callback.listen;
}
```
Then we can use it in the following code to get the results below:
```
function done(){
	console.log('Done');
}

var logger = application.call(console.log);
var log = logger();

log('Start');
waitThen(5)(done)(logger('End'));
log('Middle');
```
```
// Console logs: "Start"
// Console logs: "Middle"
// After 5 seconds ...
// Console logs: "Done"
// Console logs: "End"
```

Here you can see that the `application` function has been used to help with doing the logging.

We can also use the `application` function to make a `waiter` helper function to be used in the event chain.

At the moment we need to revert back the previous callback style to work with `application` but I am thinking of adapting `application` so we can work with the `llac` style of callbacks also.

```
function waiterFunction(seconds, callback){
	return waitThen(seconds)(callback);
}
```
Anyway, we can use this function to create a `waiter` helper function and use it in the following ways:
```
var waiter = application(waiterFunction);
var wait1 = waiter(1);
var wait2 = waiter(2);

log('Start');
wait1(logger('1 second been'))(waiter(1, logger('2 seconds been')));
log('Middle');
```
We can't add any further steps to this chain using `application` and `llac` together.
This is where `callbackApp` comes in.

## callbackApp()
This function is a combination of the `application` and `llac` functions and returns an application that has a callback system implemented.
Now we can use the following code to add an endless chain of `waitThen` functions.
```
var waitFor = callbackApp(waitThen);
var waitFor3 = waitFor(3).listenCall(logger('Wait for 3 done'));
waitFor3()(waitFor(3).listenCall(logger('Six seconds been')));
```