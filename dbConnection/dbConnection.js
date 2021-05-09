const Sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE,process.env.AD_USER,process.env.AD_PASS,{
    host : process.env.HOST,
    dialect : process.env.DIALECT,
    pool : {max : 5, min : 0},
    logging : console.log
})


module.exports = sequelize;