const { Model, DataTypes, Sequelize } = require('sequelize');
// const User = require('.');
const sequelize = require('../dbConnection/dbConnection');
const bcrypt = require('bcrypt');
const uuid = require('uuid').v4;

class User extends Model {
    generateHash(password){
        return bcrypt.hash(password, bcrypt.genSaltSync(8));
    }
     validPassword(password, hash) {
        return bcrypt.compare(password, hash);
      }
 }

User.init({
    id : {
        type : DataTypes.STRING,
        primaryKey : true,
    },
    firstName: {
        type: DataTypes.STRING,
        // defaultValue: Sequelize.UUIDV4
    },
    lastName: {
        type: DataTypes.STRING
    },
    dob: {
        type: DataTypes.DATE,
        defaultValue : new Date()
    },
    gender: {
        type: DataTypes.STRING,
    },
    weight: { type: DataTypes.DECIMAL },
    height: { type: DataTypes.DECIMAL },
    address: {
        type: DataTypes.STRING,
    },
    mobileNo: {
        type: DataTypes.BIGINT,
        unique :true
    },
    emailAddress: {
        type: DataTypes.STRING,
        allowNull : false,
        unique : true
    },
    password : {
        type : DataTypes.STRING,
        allowNull : false
    }
}, {
    sequelize,
    modelName: 'User'
})

User.beforeCreate(async(user)=>{
    if(!user.firstName){
        // user.firstName = uuid.v4();
        user.id = uuid();
        const emailFirst = user.emailAddress.split("@");
        user.firstName = emailFirst[0];
    }
    user.password = await user.generateHash(user.password);
})

module.exports = User;