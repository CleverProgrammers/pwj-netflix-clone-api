const express = require('express') // importing express
const app = express() // initialize express
const port = 3000 //setting the port 

// using the get method
// LOGIC for the Get Request
// I'm trying to get data
app.get('/', (req, res) => {
  res.send("Hellow World")
})

// start our app
// listening to the port 
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})