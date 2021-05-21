const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const User = require('./models/User');
const Admin = require('./models/Admin');
const Jobrole = require('./models/jobrole');
const session = require('express-session');
const flash = require('connect-flash');

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');


const cloudinary = require('cloudinary');
const Formidable = require('formidable');
const util = require('util');


const { requireAuth, checkUser, requireAuthAdmin, checkAdmin } = require('./middleware/authMiddleware');
const authRoutes = require('./routes/authRoutes');
const { ResumeToken } = require('mongodb');

const app = express();
dotenv.config({path: './.env'});

app.use(flash());
app.use(session({secret: 'ssshhh', saveUninitialized: true, resave: true}));
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

// mail config

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'architkeshri4@gmail.com',
    pass: process.env.EMAIL_APP_PASS
  }
});

//middleware
app.get('/', checkUser);
app.get('/main-form', checkUser);
app.post('/demo', checkUser);

app.get('/findbyrole',requireAuthAdmin);
app.get('/displayres-:role', requireAuthAdmin);
app.post('predict-admin',requireAuthAdmin);

app.get('/findbyrole', checkAdmin);
app.get('/displayres-:role', checkAdmin);
app.post('main-form-admin',checkAdmin);

// Reset Password Functionality

// Password Verification link to be sent to the email provided in this form!
app.get('/forget-password',(req,res)=>{
  res.render('forgotPassword');
});

//Check if user with given mail is registered in  post method 
app.post('/forget-password',(req,res)=>{
  var{email} = req.body;// email taken  from the form

  // check is email is of user
  User.findOne({'email':email},(err,result)=>{
    if(err|| result === null){
      // if not user check if email is for admin
      Admin.findOne({'email':email},(err,result)=>{
        if(err || result === null){
          return res.send("USER does not exists");
        }
        // Admin Found 
        else{
          
          console.log(result._id);
          let secret = process.env.JWT_PASSWORD_RESET_SECRET + result.password;
          let payload = {
            email:result.email,
            _id: result._id
          }
          let token = jwt.sign(payload, secret,{expiresIn:'10m'});
          let link = `http://localhost:8000/reset-password/${result._id}/${token}`;
          console.log(link)
          //send mail to admin
          let mailOptions = {
            from: 'architkeshri4@gmail.com',
            to: email,
            subject: 'Sending Email using Node.js',
            text: `password link ${link}`
          };
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
              return res.send(`email has been sent to admin ${email}`);

    
            }
          });
        
         
        }
      });
    }
    //user found 
    else{
      
      console.log(result._id)
      let secret = process.env.JWT_PASSWORD_RESET_SECRET + result.password;
      let payload = {
        email:result.email,
        _id: result._id
      }
      let token = jwt.sign(payload, secret,{expiresIn:'10m'});
      let link = `http://localhost:8000/reset-password/${result._id}/${token}`;
      console.log(link)
      // send mail to user
      let mailOptions = {
        from: 'architkeshri4@gmail.com',
        to: email,
        subject: 'Sending Email using Node.js',
        text: `password link ${link}`
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
          return res.send(`email has been sent to user ${email}`);

        }
      });
     
    }
  })
});

app.get('/reset-password/:id/:token',(req,res)=>{
  let {id,token} = req.params;
  console.log(id,token);
  User.findOne({'_id':id},(err,result)=>{
    if(err || result === null){
      Admin.findOne({'_id':id},(err,result)=>{
        if(err || result === null){
          res.send("Invalid Link or Link Expired")
        }
        else{
          let secret = process.env.JWT_PASSWORD_RESET_SECRET + result.password;
          try {
            let paylod = jwt.verify(token,secret);
            return  res.render('resetPassword',{email: result.email});
    
          } catch (error) {
            console.log(error);
            res.send("errorrrrrr!");
          }
        }

      });
   
    }
    else{
      let secret = process.env.JWT_PASSWORD_RESET_SECRET + result.password;
      try {
        let paylod = jwt.verify(token,secret);
        return  res.render('resetPassword',{email: result.email});

      } catch (error) {
        res.send("errrrr!");
        console.log(error);
      }
    }
  });
  
});

app.post('/reset-password/:id/:token',(req,res)=>{

  let {id,token} = req.params;
  let{password,confirmPassword} = req.body;
  if(password !== confirmPassword){
    return res.send("Password Did Not Match");
  }
  User.findOne({'_id':id},(err,result)=>{
    if(err || result === null){
      Admin.findOne({'_id':id},(err,result)=>{
        if(err || result === null){
          res.send("Invalid Link or Link Expired")
        }
        else{
          let secret = process.env.JWT_PASSWORD_RESET_SECRET + result.password;
          try {
            let paylod = jwt.verify(token,secret);
            bcrypt.genSalt(10,(err,salt)=>{
              if(err){
                console.log(err);
                return;
              }
              bcrypt.hash(password,salt,(err,hash)=>{
                Admin.updateOne({'_id':paylod._id},{'password':hash},(err,result)=>{
                  if(err){
                    console.log(err);

                  }
                  else{
                    res.send("success");
                  }
                });
                
              })
            });
          } catch (error) {
            console.log(error);
            res.send("errorrrrrr!");
          }
        }
      });
    }
    else{
      let secret = process.env.JWT_PASSWORD_RESET_SECRET + result.password;
      try {
        let paylod = jwt.verify(token,secret);
        bcrypt.genSalt(10,(err,salt)=>{
          if(err){
            console.log(err);
            return;
          }
          bcrypt.hash(password,salt,(err,hash)=>{
            User.updateOne({'_id':paylod._id},{'password':hash},(err,result)=>{
              if(err){
                console.log(err);

              }
              else{
                return res.send("success");
              }
            });
            
          })
        });
      } catch (error) {

        console.log(error);
        return res.send("errorrrr!");
      }
    }
  });
});

app.post('/addrole', async (req,res) =>{
  const { id, st } = req.body;
  User.updateOne({_id: id}, 
    {$addToSet: {roles: st}}, (err, result) =>{
    if(err){
      console.log(err);
    }
    else{
      res.redirect('/dashboard');
  }});
});

app.get('/findbyrole', (req,res)=> {
    Jobrole.find({}, function(err,roles) {
      if(err){
        console.log(err);
      }
      else{
        res.render('findbyrole', {roles});
      }
    });
});

app.get('/displayres-:role', async (req,res) =>{
  var role = req.params.role;
  console.log(role);
  try {
    const results = await User.findbyrole(role);
    if(results){
      res.render('displayres', {results});
    }
  } catch (error) {
    console.log(error);
  }
})

app.get('/dashboard', checkUser);
app.get('/main-form-admin', checkAdmin);

//routes
app.get('/', (req,res) => { 
    res.render('home');
});
app.get('/main-form', requireAuth, (req, res) => res.render('main-form'));

app.get('/main-form-admin', requireAuthAdmin, (req, res) =>{ 
  
  res.render('main-form-admin',{message:req.flash('success')});


});
app.get('/dashboard', requireAuth, (req, res) => res.render('dashboard'));

app.use(authRoutes);


app.post('/demo', (req,res)=>{
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
  
    var date = Date().substring(4,21) + " IST";
   
    var prediction = {
      s1: str[0].slice(2,str[0].length-2),
      s2: str[1].slice(2,str[1].length-2),
      s3: str[2].slice(2,str[2].length-2),
      s4: str[3],
      s5: str[4].slice(0,str[4].length-12),
      s6: str[5],
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


app.post('/predict-admin',(req,res)=>{

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
  var process = spwan('py',['./predict.py',q1, q2, q3, q4, q5, q6, q7, q8, q9, q10,
                q11, q12a, q12b, q13a, q13b, q14, q15, q16, q17, q18, q19 ]

  // userdata = req.body;
  // var process = spwan('py',['./abc.py', userdata]

  );
 
  
  process.stdout.on('data',(data)=>{
    d = data.toString();
    var str = d.split("\r\n");
    str.pop();
    
    var s1 = str[0].slice(2,str[0].length-2);
    var s2 = str[1].slice(2,str[1].length-2);
    var s3 = str[2].slice(2,str[2].length-2);
    // var date = Date().substring(4,21) + " IST";
   
    // var prediction = {
    //   s1: str[0].slice(2,str[0].length-2),
    //   s2: str[1].slice(2,str[1].length-2),
    //   s3: str[2].slice(2,str[2].length-2),
    //   response: {q1: q1, q2: q2, q3: q3, q4: q4, q5: q5, q6: q6, q7: q7, q8: q8, q9: q9, q10: q10, q11: q11, q12a: q12a, q12b: q12b, q13a: q13a, q13b: q13b, q14: q14, q15: q15, q16: q16, q17: q17, q18: q18, q19: q19},
    //   date:date
    // }
    if(s1 === "Software Quality Assurance (QA) / Testing"){
        s1 = "Software Quality Assurance";
    }
    if(s2 === "Software Quality Assurance (QA) / Testing"){
      s2 = "Software Quality Assurance";
    }
    if(s3 === "Software Quality Assurance (QA) / Testing"){
        s3 = "Software Quality Assurance";
    }
    var result = `Predcited Job Roles are ${s1}, ${s2} and ${s3}`;

    req.flash('success', result);
    res.redirect('/main-form-admin');
  
  });

 

});


// Cloudinary configuration for profile pic
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

// Profile pic uploading on cloudinary
app.post('/dashboard/upload', requireAuth, (req, res) => {
  // parse a file upload
   const form = new Formidable();
   form.parse(req, (err, fields, files) => {
    cloudinary.uploader.upload(files.upload.path, result => {
      console.log(result)
      if (result.public_id) {
          res.send('Uploaded Successfully! on ' + result.url);
        }
    });
  });
});


const port = 8000;
app.listen(port, () =>{
    console.log(`Server is running on localhost ${port}`);
});


