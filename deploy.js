const FtpDeploy = require('ftp-deploy');

const ftpDeploy = new FtpDeploy();

const config = {
  user: 'user',
  password: 'password',
  host: 'vh392.timeweb.ru',
  port: 21,
  localRoot: `${__dirname}/dist`,
  remoteRoot: '/public_html/',
  include: ['**.*'],
  exclude: [
    'dist/**/*.map',
    'node_modules/**',
    'node_modules/**/.*',
    '.git/**',
  ],
  deleteRemote: true,
  forcePasv: true,
  sftp: false,
};

ftpDeploy
  .deploy(config)
  .then((res) => console.log('finished:', res))
  .catch((err) => console.log(err));
