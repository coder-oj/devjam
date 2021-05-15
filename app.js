const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app = express();

//middleware
app.use(express.static(__dirname+'/public'));
app.use(express.json());

//view engine
app.set('view engine', 'ejs');

//bodyparser
app.use(bodyParser.urlencoded({extended: true}));

//Connection to Atlas
mongoose.connect('mongodb+srv://prakhar:C7GNob3mCp7wRgkq@cluster0.6nuob.mongodb.net/Cerial-Killers?retryWrites=true&w=majority', {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false}).then(() => {
  console.log('Connection Successful');
}).catch((err) => { console.log(err);});

//Schema
const userSchema = {
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true},
    degree: { type: String, required: true},
    college: { type: String, required: true},
    gradyear: { type: String, required: true},
    linkedin: { type: String, required: true},
    result: Array
   };
  
const users = mongoose.model("users", userSchema);
  

//routes
app.get('/', (req,res) => {
    
    res.render('home');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    let user_details = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    degree: req.body.degree,
    college: req.body.college,
    gradyear: req.body.gyear,
    linkedin: req.body.linkedin,
    };

    const user= new users(user_details);
    console.log(user_details);// console (testing)
      //data saved to db
      user.save(function(err){
          if(err){
              console.log(err);
          }
          else{
            console.log("Data Inserted Successfully");
            //alert("Data Inserted Successfully");
          }

      });

    res.render('login');
});

app.use(authRoutes);

const port = 8000;
app.listen(port, () =>{
    console.log(`Server is running on localhost ${port}`);
});