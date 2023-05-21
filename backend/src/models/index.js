"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

config.dialect = process.env.DB_DIALECT;

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

// Add your models here
db.User = require("./user")(sequelize, Sequelize.DataTypes);
db.Log = require("./log")(sequelize, Sequelize.DataTypes);
db.Category = require("./category")(sequelize, Sequelize.DataTypes);
db.Account = require("./account")(sequelize, Sequelize.DataTypes);
db.AccountUser = require("./accountuser")(sequelize, Sequelize.DataTypes);
db.CreditCard = require("./creditcard")(sequelize, Sequelize.DataTypes);
db.RecurringBill = require("./recurringbill")(sequelize, Sequelize.DataTypes);
db.Installment = require("./installment")(sequelize, Sequelize.DataTypes);
db.Goal = require("./goal")(sequelize, Sequelize.DataTypes);
db.Transaction = require("./transaction")(sequelize, Sequelize.DataTypes);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
