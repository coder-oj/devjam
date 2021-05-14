const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');

const app = express();

//middleware
app.use(express.static(__dirname+'/public'));
app.use(express.json());

//view engine
app.set('view engine', 'ejs');

//routes
app.get('/', (req,res) => res.render('home'));
app.use(authRoutes);

const port = 8000;
app.listen(port, () =>{
    console.log(`Server is running on localhost ${port}`);
});