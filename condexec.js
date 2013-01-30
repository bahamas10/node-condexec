var spawn = require('child_process').spawn;
var util = require('util');

module.exports = condexec;

function condexec(options, cb) {
  if (!options.exec)
    return cb(new Error('exec attribute must be present'));

  cb = cb || function() {};

  var funcs = [];
  var lasti;
  // create the function chain, the order is onlif, notif, then exec
  ['exec', 'notif', 'onlyif'].forEach(function(key, i) {
    var cmd = options[key];
    if (!cmd) return;

    // shell parsing requested
    if (typeof cmd === 'string')
      cmd = ['/bin/sh', '-c'].concat(cmd);

    // the expected return code and next function to call
    var expected = key === 'notif' ? !0 : 0;
    var next = funcs[lasti] || cb;

    funcs.push(function() { doexec(cmd, expected, key, next); });
    lasti = i;
  });

  // start the chain
  funcs[funcs.length - 1]();

  function doexec(cmd, expected, name, next) {
    var c = typeof options[name] === 'string' ? cmd[2] : cmd;
    debug('[%s] about to execute `%s`, expects %s',
        name, c, expected ? '!= 0' : '0');

    exec(cmd, options, function(code) {
      var msg = util.format('[%s] command `%s` returned with code %d', name, c, code);
      debug(msg);

      if (code != expected) {
        return cb(new Error(msg));
      }
      next();
    });
  }

  // debug output if requested
  function debug() {
    if (options.debug) console.error.apply(console, arguments);
  }
}


/**
 * taken from the `exec` module and modified for streaming output
 */
// node v0.8 changed the events that are emitted at the end
// of spawn, this line will be used to make it possible
// for this module to work for both v0.6 and v0.8 (and above hopefully)
var v = process.version.split('.')[1];
function exec(args, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = null;
  }
  if (typeof args === 'string') {
    args = [args];
  }

  var code;
  var i = 0;

  var child = spawn(args[0], args.slice(1), opts);

  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);

  child.on('exit', function(c) {
    code = c;
    if (++i >= 2 || v < 8) callback(code);
  });

  child.on('close', function() {
    if (++i >= 2) callback(code);
  });

  return child;
}
