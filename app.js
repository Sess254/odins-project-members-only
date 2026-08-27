const path = require("node:path");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const PORT = 3000;
const router = require('./routes/usersRouters');


const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use('/', router);

app.listen(PORT, (error) => {
    if (error) {
        console.error(error);
    }
    console.log(`Listening on port ${PORT}`);
})