const express = require('express') // importing express
const app = express() // initialize express
const port = 3000 //setting the port 
const mongoose = require('mongoose');
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

// using the get method
// LOGIC for the Get Request
// I'm trying to get data
app.get('/', (req, res) => {
  res.send("Hellow World")
})

app.post('/register', (req, res)=>{
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  })

  newUser.save((err, user)=>{
    if(err){
      console.log(err);
      res.send(400, {
        status: err
      })
    } else {
      console.log("all is good");
      console.log(user);
      res.send("registered")
    }
  })
})

app.post('/login', (req, res) => {
  const password = req.body.password;
  const email = req.body.email;
  console.log(email);
  console.log(password);
  User.findOne({ email: email, password: password }, (err, user)=>{
    if(user){
      res.send({
        status: "valid",
        token: user.id
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
