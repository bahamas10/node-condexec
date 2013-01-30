var condexec = require('../');

condexec({
  cwd: '/',
  onlyif: 'test -f /etc/passwd',
  notif: 'test -d /aoehsutoehnaueohs/fake/fake/fake',
  exec: 'echo "hello $USER you are in $PWD"'
}, done);

function done(err) {
  if (err) throw err;
  console.log('success!');
}
