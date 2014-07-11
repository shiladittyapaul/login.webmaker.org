var Sequelize = require('sequelize');

module.exports = function(env) {

  var sequelize;
  var health = {
    connected: false,
    err: null
  };
  var handlers = require('./utils/handlers')(health);
  var db = env.get('DB');
  var dbOptions = env.get('DBOPTIONS');

  // Initialize
  try {
    sequelize = new Sequelize(db.database, db.username, db.password, dbOptions);
  } catch (error) {
    handlers.dbErrorHandling(error, handlers.forkErrorHandling);
  }

  // Controllers
  var UserCtrl = require('./user')(sequelize);

  // Sync
  sequelize.sync().complete(function(err) {
    if (err) {
      handlers.dbErrorHandling(err, handlers.forkErrorHandling);
    } else {
      health.connected = true;
      handlers.forkSuccessHandling();
    }
  });

  // Export models
  return {
    User: UserCtrl
  };

};