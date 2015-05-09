var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'megam'
    },
    port: 3000,
    db: 'postgres://localhost/megam_development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'megam'
    },
    port: 3000,
    db: 'postgres://localhost/megam_test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'megam'
    },
    port: 3000,
    db: 'postgres://localhost/megam_production'
  }
};

module.exports = config[env];
