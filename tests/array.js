var condexec = require('../');

condexec({
  exec: ['ls', '-l', '-h'],
  onlyif: ['true'],
  notif: ['false']
}, done);

function done(err) {
  if (err) throw err;
  console.log('success!');
}
