const express = require("express");
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

//Connect to DB
mongoose.connect(process.env.DB_CONNECT
,{ useNewUrlParser: true , useUnifiedTopology: true}
,() => console.log('connected to db'));

//Middlewares
app.use(express.json());

//Routes
const authRoute = require('./routes/auth');
const productRoute = require('./routes/products');
const orderRoute = require('./routes/orders');

//Route Middlewares
app.use('/api/user', authRoute);
app.use('/api/products', productRoute);
app.use('/api/orders', orderRoute);


app.listen(3000, () => {
    console.log("Server running on port 3000");
});

module.exports = app;