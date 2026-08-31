const path = require("node:path")
const express = require("express")
const session = require("express-session")
const passport = require("passport")
const pool = require('./db/pool')
const LocalStrategy = require('passport-local').Strategy
const router = require('./routers/router')
const bcrypt = require('bcryptjs')
const flash = require('connect-flash')

const app = express()
app.set('views', path.join(__dirname, "views"))
app.set('view engine', 'ejs')

// 1. PARSE URLENCODED BODY FIRST (Crucial for Passport to read form inputs)
app.use(express.urlencoded({ extended: false }))

// 2. THEN SESSIONS & PASSPORT
app.use(session({ secret: "cats", resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// 3. THEN RES.LOCALS MIDDLEWARE
app.use((req, res, next) => {
    res.locals.currentUser = req.user
    next()
})

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username])
            const user = rows[0];

            if (!user) {
                return done(null, false, { message: 'Incorrect username' })
            }

            const match = await bcrypt.compare(password, user.password)
            
            if (!match) {
                return done(null, false, { message: "Incorrect password" })
            }


            return done(null, user)
        } catch (err) {
            console.error(err)
            return done(err)
        }
    })
)

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser(async (id, done) => {
    try {
        const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id])
        const user = rows[0]
        done(null, user)
    } catch (err) {
        done(err)
    }
})

app.use((req, res, next) => {
    res.locals.messages = req.flash('error')
    next()
})

app.get('/', (req, res) => {
    const messages = req.session.messages || []
    req.session.messages = []
    res.render('index', { user: req.user })
})

app.use('/', router);

app.post(
    "/log-in",
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/",
        failureFlash: true,
    })
)

app.get("/log-out", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        res.redirect("/")
    })
})

app.listen(3000, (error) => {
    if (error) {
        console.error(error);
    }
    console.log('Listening on port 3000')
})