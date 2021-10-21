const express = require('express');
const mongoose = require('mongoose');

const users = require ('./routes/api/users');
const profile = require ('./routes/api/profile');
const post = require ('./routes/api/post');

const app = express();

//DB config
const db = require ('./config/keys').mongoURI;

//connect to MongoDB
mongoose
    .connect(db)
    .then(console.log("MongoDB Connected"))
    .catch(e=>console.log(e))

app.get('/', (req, res)=>res.send('Hello World!'));

//use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/post', post);

const port = process.env.PORT || 5000;

app.listen(port, ()=>console.log(`Server Running on Port ${port}`))