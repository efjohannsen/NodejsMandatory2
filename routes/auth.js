const router = require('express').Router();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { request } = require('express');

require('dotenv').config();

const pool = mysql.createPool({
    host        : process.env.DB_HOST,
    user        : process.env.DB_USER,
    password    : process.env.DB_SECRET,
    database    : process.env.DB_DBNAME,
    port        : process.env.DB_PORT,
    waitForConnections  : true,
    connectionLimit     : 10,
    queueLimit          : 0
});

let refreshTokens = [];

router.post("/token", (req, res) => {
    const refreshToken = req.body.token;
    if(refreshToken == null) return res.sendStatus(401);
    if(!refreshTokens.includes(refreshToken)) {
        res.sendStatus(403);
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err) {return res.sendStatus(403)};
        const accessToken = generateAccessToken({ name: user.name })
        res.json({accessToken : accessToken})
    })
})

router.post("/login", async (req, res) => {
    try {
        const username = req.body.username;
        const result = await pool.query('SELECT password FROM users WHERE username = ?', [username]);
        //does not exist || array empty
        if(result[0][0] === undefined || result[0][0].length == 0) {
            return res.status(403).send("Incorrect username");
        }
        const hashedPassword = result[0][0].password;
        const plainTextPassword = req.body.password;
        if(await bcrypt.compare(plainTextPassword, hashedPassword)){
            //user authenticated here.
            const user = { name: username };
            const accessToken = generateAccessToken(user);
            const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
            
            //should be stored in db.
            refreshTokens.push(refreshToken);

            const options = {
                maxAge: 15000, //15 sekunder bør sættes op
                httpOnly: false 
            }
            res.cookie("accessToken", accessToken, options);
            res.cookie("refreshToken", refreshToken);
            res.send("You are now logged in");
        }
        else {
            res.status(403).send("Password incorrect");
        }               
    } catch (err) {
        res.send(err);
    }
});

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '120s' })
}

router.post("/register", async (req, res) => {
    try {
        const username = req.body.username;
        const plainTextPassword = req.body.password;
        const email = req.body.email;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
        await pool.execute('INSERT INTO users SET username = ?, password = ?, email = ?', [username, hashedPassword, email]);
        return res.redirect("/index");
    } catch (err) {
        return res.status(500).send(err);
    }
});

router.get("/logout", (req, res) => {
    return res.status(501).send();
});

module.exports = router;