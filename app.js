const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const app = express();

//middleware
app.use(express.static(__dirname+'/public'));
app.use(express.json());

//view engine
app.set('view engine', 'ejs');

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
    //dummy object (testing purpose)
    let content={
    name: "Ojaswi Gupta",
    email: "ojaswi.2020ca051@mnnit.ac.in",
    password: "12345",
    degree: "MCA",
    college: "MNNIT",
    gradyear: "2023",
    linkedin: ".../coder-oj",
    result: [{prediction: "System Analyst",date: Date().substring(4,21) + " IST"}, {prediction: "Product Manager",date: Date().substring(4,21) + " IST"}]   
    };
      //creating new document for each new user
      const user= new users(content);
      console.log(content);// console (testing)
      //data saved to db
      user.save();

      res.send("data Inserted");
    //res.render('home');
});

app.post('/', )
app.use(authRoutes);

const port = 8000;
app.listen(port, () =>{
    console.log(`Server is running on localhost ${port}`);
});