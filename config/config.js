var path = require('path'),
  rootPath = path.normalize(__dirname + '/..'),
  env = process.env.NODE_ENV || 'development',
  influx = require('influx');

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'megam'
    },
    port: 3000,
    db: 'postgres://localhost/megam_development',
    nirvagi: 'tcp://127.0.0.1:3030',
    influxClient: influx({
      host: 'localhost',
      port: 8086,
      username: 'root',
      password: 'root',
      database: 'megam_development'
    })
  }
};

module.exports = config[env];
