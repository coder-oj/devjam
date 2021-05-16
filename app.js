const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

const { requireAuth, checkUser, requireAuthAdmin, checkAdmin } = require('./middleware/authMiddleware');
const authRoutes = require('./routes/authRoutes');

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
app.get('/adminhome', checkAdmin);

//routes
app.get('/', (req,res) => { 
    res.render('home');
});
app.get('/main-form', requireAuth, (req, res) => res.render('main-form'));
app.get('/adminhome', requireAuthAdmin, (req, res) => res.render('adminhome'));

app.use(authRoutes);


app.post('/demo',(req,res)=>{

  let spwan = require('child_process').spawn;
  console.log(req.body.fname);
  var formdata = req.body.fname;
  var process = spwan('py',['./abc.py',
  'Archit',formdata
  ]
  );
  process.stdout.on('data',(data)=>{
    d = data.toString();
    res.send(d);
  });

});

const port = 8000;
app.listen(port, () =>{
    console.log(`Server is running on localhost ${port}`);
});
