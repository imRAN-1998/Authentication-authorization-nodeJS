const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const sequelize = require('./dbConnection/dbConnection');
const userRouter = require('./routes/user');


const app = express();
app.set('view engine','ejs')
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : false}))








// require('./models');


app.use('/user',userRouter);





sequelize.authenticate()
.then(()=>{
    console.log("authentication successful!");
    sequelize.sync();
})
.catch(()=>{
    console.log("authenication failed!!");
})
app.listen(process.env.PORT,()=>{
    console.log(`Server started listening to port : ${process.env.PORT}`)
})