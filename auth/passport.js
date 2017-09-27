const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;

const models = require('../db/models').models;

passport.serializeUser(function (user, done) {
    done(null, user.email);
});

passport.deserializeUser(function (email, done) {
    models.User.findOne({
        where: {
            email: email
        }
    }).then((user) => {
        done(null, user);
    })
});

passport.use(new LocalStrategy(function (username, password, cb) {
    models.UserLocal.findOne({
        where: {
            username: username
        },
        include: [models.User]
    }).then((userlocal) => {
        if (!userlocal) {
            return cb(null, false, {message: 'Wrong Username'})
        }

        if (userlocal.password == password) {
            return cb(null, userlocal.user)
        } else {
            return cb(null, false, {message: 'Wrong Password'})
        }

    }).catch((err) => {
        return cb(err, false);
    })
}));

passport.use(new BearerStrategy(function (token, done) {
    models.AuthToken.findOne({
        where: {
            token: token
        },
        include: [models.User]
    }).then((authtoken) => {

        if (authtoken && (authtoken.user)) {
            return done(null, authtoken.user)
        } else {
            return done(null, false, {message: 'Could not authorize'})
        }
    }).catch((err) => {
        return done(err, false)
    })
}));

module.exports = passport;