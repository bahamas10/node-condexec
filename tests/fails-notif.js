var condexec = require('../');

condexec({
  cwd: '/tmp',
  onlyif: 'test -f /etc/passwd',
  notif: 'test -f /etc/passwd',
  exec: 'echo "hello $USER you are in $PWD"'
}, done);

function done(err) {
  if (!err instanceof Error) throw new Error('command passed');;
  console.error(err.message);
  console.log('success!');
}
