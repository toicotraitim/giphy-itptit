const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 5000;

require('dotenv').config();


  
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    secret : "secret",
    saveUninitialized: true,
    resave: true
}));
app.use(cookieParser('secret'));
app.use(passport.initialize());
app.use(passport.session());
  

if(process.env.NODE_ENV === "development") {
    console.log("development");
    app.use(cors({
        origin: process.env.CLIENT_URL
    }));
    app.use(morgan('dev'));
}
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB connected");
});


const authRouter = require('./routes/api.route');
app.use('/api',authRouter);

app.use((req,res,next) => {
    res.status(404).json({
        success: false,
        message: "404 Not Founded"
    })
});
app.listen(PORT, () => {
    console.log("SERVER CONNECTED ", PORT);
});