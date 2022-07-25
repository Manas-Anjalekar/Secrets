require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const md5 = require('md5');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

mongoose.connect('mongodb+srv://admin-Manas:AdminPassword@cluster0.i4vdm.mongodb.net/secretDB?retryWrites=true', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide a suitable email!'],
    minlength: 5
  },
  password: {
    type: String,
    required: [true, 'Please provide a suitable content password!'],
    minlength: 5
  }
});

const User = mongoose.model('User', userSchema);

app.get('/', function(req, res){
  res.render('home');
});

app.get('/login', function(req, res){
  res.render('login');
});

app.get('/register', function(req, res){
  res.render('register');
});

app.post('/register', function(req, res){
  const user = new User( {
    email: req.body.email,
    password: md5(req.body.password)
  } );

  user.save( function(err){
    if(err){
      console.log(err);
    }else{
      res.render('secrets');
    }
  } );
});

app.post('/login', function(req, res){

  const email = req.body.email;
  const password = md5(req.body.password);

  User.findOne( {email: email}, function(err, user) {
    if(err){
      console.log(err);
    }else{
      if(user){
        console.log('found the user #' + user._id);
        if(user.password === password){
          res.render('secrets');
        }
      }
    }
  } );
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port ", port);
});
