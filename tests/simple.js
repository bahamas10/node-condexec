var condexec = require('../');

condexec({
  exec: 'ls'
}, done);

function done(err) {
  if (err) throw err;
  console.log('success!');
}
