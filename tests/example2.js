var condexec = require('../');

var file = '/etc/passwd';
var msg = 'this message has double"quotes and single\'quotes';
condexec({
  exec: ['echo', msg],
  onlyif: ['test', '-f', file]
}, function(err) {
  if (err) throw err;
  console.log('success!');
});
