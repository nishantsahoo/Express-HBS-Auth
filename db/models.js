const Sequelize = require('sequelize');

const db = new Sequelize('authtable', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
});

const User = db.define('user', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.STRING,
    email: Sequelize.STRING
});

const UserLocal = db.define('userlocal', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: Sequelize.STRING,
    password: Sequelize.STRING
});

const AuthToken = db.define('authtoken', {
    token: {
        type: Sequelize.STRING,
        primaryKey: true
    }
});

UserLocal.belongsTo(User);
User.hasOne(UserLocal);

AuthToken.belongsTo(User);
User.hasMany(AuthToken);

db.sync({force: false})
    .then(() => {
        console.log("Database Synchronised");
    })
    .catch((err) => {
        console.log("Error setting up Database");
        console.error(err);
    });

module.exports = {
    db,
    models: {
        User,
        UserLocal,
        AuthToken
    }
};