const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const User = require('./models/User');
const Admin = require('./models/Admin');
//const Jobrole = require('./models/jobrole');

const { requireAuth, checkUser, requireAuthAdmin, checkAdmin } = require('./middleware/authMiddleware');
const authRoutes = require('./routes/authRoutes');
const { ResumeToken } = require('mongodb');

const app = express();
dotenv.config({path: './.env'});

//middleware
app.use(express.static(__dirname+'/public'));
app.use(express.json());
app.use(cookieParser());

//view engine
app.set('view engine', 'ejs');

//bodyparser
app.use(bodyParser.urlencoded({extended: true}));

//Connection to Atlas
mongoose.connect(process.env.DATABASE_URL , {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false}).then(() => {
  console.log('Connection Successful');

}).catch((err) => { console.log(err);});



//middleware
app.get('/', checkUser);
app.get('/main-form', checkUser);
app.post('/demo', checkUser);
app.get('/dashboard', checkUser);
app.get('/adminhome', checkAdmin);

//routes
app.get('/', (req,res) => { 
    res.render('home');
});
app.get('/main-form', requireAuth, (req, res) => res.render('main-form'));
app.get('/adminhome', requireAuthAdmin, (req, res) => res.render('adminhome'));
app.get('/dashboard', requireAuth, (req, res) => res.render('dashboard'));

app.use(authRoutes);


app.post('/demo',checkUser, (req,res)=>{
  //console.log(res.locals.user);
  let spwan = require('child_process').spawn;
  console.log(req.body);
  var q1 = req.body.q1;
  var q2 = req.body.q2;
  var q3 = req.body.q3;
  var q4 = req.body.q4;
  var q5 = req.body.q5;
  var q6 = req.body.q6;
  var q7 = req.body.q7;
  var q8 = req.body.q8;
  var q9 = req.body.q9;
  var q10 = req.body.q10;
  var q11 = req.body.q11; 
  var q12a = req.body.q12a;
  var q12b = req.body.q12b;
  var q13a = req.body.q13a;
  var q13b = req.body.q13b;
  var q14 = req.body.q14;
  var q15 = req.body.q15;
  var q16 = req.body.q16;
  var q17 = req.body.q17;
  var q18 = req.body.q18;
  var q19 = req.body.q19;
  var process = spwan('python',['./predict.py',q1, q2, q3, q4, q5, q6, q7, q8, q9, q10,
                q11, q12a, q12b, q13a, q13b, q14, q15, q16, q17, q18, q19 ]

  // userdata = req.body;
  // var process = spwan('py',['./abc.py', userdata]

  );
   console.log('id'+ res.locals.user._id);
  
  process.stdout.on('data',(data)=>{
    d = data.toString();
    var str = d.split("\r\n");
    str.pop();
    

    // to get current date
    // var todayTime = new Date();
    // var month = todayTime .getMonth() + 1;
    // var day = todayTime .getDate();
    // var year = todayTime .getFullYear();
    var date = Date().substring(4,21) + " IST";
    
   
    var prediction = {
      s1: str[0].slice(2,str[0].length-2),
      s2: str[1].slice(2,str[1].length-2),
      s3: str[2].slice(2,str[2].length-2),
      response: {q1: q1, q2: q2, q3: q3, q4: q4, q5: q5, q6: q6, q7: q7, q8: q8, q9: q9, q10: q10, q11: q11, q12a: q12a, q12b: q12b, q13a: q13a, q13b: q13b, q14: q14, q15: q15, q16: q16, q17: q17, q18: q18, q19: q19},
      date:date
    }
    if(prediction.s1 === "Software Quality Assurance (QA) / Testing"){
      prediction.s1 = "Software Quality Assurance";
    }
    if(prediction.s2 === "Software Quality Assurance (QA) / Testing"){
      prediction.s2 = "Software Quality Assurance";
    }
    if(prediction.s3 === "Software Quality Assurance (QA) / Testing"){
      prediction.s3 = "Software Quality Assurance";
    }
   
  
    User.updateOne({'_id':res.locals.user.id},
      {$push : {'result':prediction}},(err,docs)=>{

        if(err){
          console.log("abc");
          console.log(err);
        }
        else{
          res.redirect('/dashboard');
        }
      });


  });



});

const port = 8000;
app.listen(port, () =>{
    console.log(`Server is running on localhost ${port}`);
});


