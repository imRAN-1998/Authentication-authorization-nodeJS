const User = require('./user.model');

// User.hasOne(UserToken,{ foreignKey : 'UserId', onDelete : 'cascade' });
// UserToken.belongsTo(User, { onDelete : 'cascade'});



module.exports = {User};