const passport = require('passport')

module.exports.checkAuth = passport.authenticate("jwt", { session: false });
