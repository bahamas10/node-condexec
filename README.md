condexec
========

Conditionally shell out an exec

Installation
------------

    npm install condexec

Usage
-----

``` js
var condexec = require('condexec');

var opts = {
  cwd: '/',
  onlyif: 'test -f /etc/passwd',
  notif: 'test -d /this/doesnt/exist',
  exec: 'echo "hello $USER you are in $PWD"'
};

condexec(opts, function(err) {
  console.log('done');
});
```

yields

```
hello dave you are in /
done
```

any and all output from the commands executed will be piped directly
to the proper streams (stdout/stderr).

### shell parsing

When the `exec`, `onlyif`, or `notif` attributes are given as strings, they are parsed
by the shell before they are ran; they are executed as ['`/bin/sh`', '`-c`', '`{string}`'].
Alternatively, you can pass an array of arguments instead of a string, which will allow
you to bypass shell-parsing/word-splitting logic.


``` js
var file = '/etc/passwd';
var msg = 'this message has double"quotes and single\'quotes';
condexec({
  exec: ['echo', msg],
  onlyif: ['test', '-f', file]
});
```

yields

```
this message has double"quotes and single'quotes
```

Notice that you didn't need to worry about escaping the quotes before you
passed them to exec.

### error handling

When the callback is fired, it will contain what specifically produced an error.

``` js
var opts = {
  onlyif: 'test -d /etc/passwd',
  notif: 'test -f /aoehsutoehnaueohs/fake/fake/fake',
  exec: 'echo "hello $USER you are in $PWD"'
};

condexec(opts, function(err) {
  console.error(err.message);
});
```

yields

```
[onlyif] command `test -d /etc/passwd` returned with code 1
```

It tells you what command failed, in what clause, and with what code.
Notice that, because the command failed, the exec line was never called.

### debug

Pass in a debug attribute to see exactly what is happening

``` js
var opts = {
  debug: true,
  cwd: '/',
  onlyif: 'test -f /etc/passwd',
  notif: 'test -d /aoehsutoehnaueohs/fake/fake/fake',
  exec: 'echo "hello $USER you are in $PWD"'
};

condexec(opts, function(err) {
  console.log('success!');
});
```

yields

```
[onlyif] about to execute `test -f /etc/passwd`, expects 0
[onlyif] command `test -f /etc/passwd` returned with code 0
[notif] about to execute `test -d /aoehsutoehnaueohs/fake/fake/fake`, expects != 0
[notif] command `test -d /aoehsutoehnaueohs/fake/fake/fake` returned with code 1
[exec] about to execute `echo "hello $USER you are in $PWD"`, expects 0
hello dave you are in /
[exec] command `echo "hello $USER you are in $PWD"` returned with code 0
success!
```

Function
--------

### function condexec(options, callback(err))

#### `options`

* `exec`: a string or array of commands to execute given the 2 optional conditions are satisfied
* `notif`: an optional condition to meet before the `exec` command is run, expects this to return non-0
* `onlyif`: an optional condition to meet before the `exec` command is run, expects this to return 0
* `debug`: turn on debug output

This object is then passed into `child_process.spawn`, so pass in any options that you would like,
such as `cwd`, `env`, etc.

#### `callback`

The callback runs when the conditional exec has finished, either successfully or with an error.
The `err` object will be `null` if it was successful

License
-------

MIT
