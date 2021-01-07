const express = require('express') // importing express
const app = express() // initialize express
const port = 3000 //setting the port 
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const { Schema } = mongoose; // Grab the schema object from mongoose
var cors = require('cors');
require('dotenv').config()

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.nonsu.mongodb.net/netflix-api-db-dev?retryWrites=true&w=majority`, {
  useCreateIndex: true,
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const User = mongoose.model('Users', new Schema(
  { 
    name: String,
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    }
  }
));

app.use(cors());

app.use(express.json());

function authenticateToken(req, res, next){
  console.log(req.headers);
  const authHeaderToken = req.headers['authorization']
  if(!authHeaderToken) return res.sendStatus(401);

  jwt.verify(authHeaderToken, "asdl4u47jj4dj", (err, user)=>{
    if(err) return res.sendStatus(403);
    req.user = user;
    next()
  })
}

// using the get method
// LOGIC for the Get Request
// I'm trying to get data
app.get('/', (req, res) => {
  res.send("Hellow World")
})

app.get('/wishlist', authenticateToken, (req, res) => {
  console.log("I am authenitcated")
  console.log(req.user);
  WishList.findOne({user: user.id}, )
  res.send({
    items: [
      "The Avengers",
      "Tenet",
      "Queens Gambit"
    ]
  })
})

app.post('/register', (req, res)=>{
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  })

  newUser.save((err, user)=>{
    if(err){
      // User already exists
      res.send(400, {
        status: err
      })
    } else {
      res.send({
        status: "registered"
      })
    }
  })
})

function genereateAccessToken(user){
  const payload = {
    id: user.id,
    name: user.name
  }
  return jwt.sign(payload, "asdl4u47jj4dj", { expiresIn: '7200s' })
}

app.post('/login', (req, res) => {
  const password = req.body.password;
  const email = req.body.email;
  User.findOne({ email: email, password: password }, (err, user)=>{
    if(user){
      const token = genereateAccessToken(user);
      res.send({
        status: "valid",
        token: token
      });
    } else {
      res.send(404, {
        status: "Not Found"
      })
    }
  })
})

// start our app
// listening to the port 
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
