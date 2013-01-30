var condexec = require('../');

condexec({
  cwd: '/',
  onlyif: 'test -d /etc/passwd',
  notif: 'test -d /aoehsutoehnaueohs/fake/fake/fake',
  exec: 'echo "hello $USER you are in $PWD"'
}, done);

function done(err) {
  if (!err instanceof Error) throw new Error('command passed');;
  console.error(err.message);
  console.log('success!');
}
