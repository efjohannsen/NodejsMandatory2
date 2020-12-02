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

//cookie optionas
const accessTokenOptions = {
    maxAge: 30000, //30 sekunder bør sættes op
    httpOnly: false 
}

const refreshTokenOptions = {
    maxAge: 120000, //120 sekunder bør sættes op
    httpOnly: false 
}

//User can renew access access token with their refreshToken.
router.post("/token", async (req, res) => {
    const refreshToken = req.body.token;
    const userId = req.body.userId;
    if(refreshToken == null) {
        return res.status(401).send("Please login"); 
    }
    const storedRefreshToken = await pool.execute('SELECT token FROM refreshTokens WHERE id = ?', [userId]);
    //check if users given refreshToken exists in db
    if(!storedRefreshToken[0][0].token === refreshToken){
        return res.status(403).send("Refresh token is not working. Try Logging in again.");
    };
    //very og generer ny access token.
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err) {
            return res.status(403).send("refreshToken is not available / valid. Please register / login again");
        };
        const accessToken = generateAccessToken({ name: user.name })
        //save cookie
        res.cookie("accessToken", accessToken, accessTokenOptions);       
        res.send('new access token set.')
    })
})

router.post("/login", async (req, res) => {
    try {
        const username = req.body.username;
        const result = await pool.execute('SELECT id,password FROM users WHERE username = ?', [username]);
        //does not exist || array empty
        if(result[0][0] === undefined || result[0][0].length == 0) {
            return res.status(403).send("Username incorrect");
        }
        const userId = result[0][0].id;
        const hashedPassword = result[0][0].password;
        const plainTextPassword = req.body.password;
        const correctPassword = await bcrypt.compare(plainTextPassword, hashedPassword);
        if(correctPassword){
            //user authenticated here.
            const user = { name: username };
            const accessToken = generateAccessToken(user);
            const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
            
            //delete old refreshToken if it exists
            await pool.execute('DELETE FROM refreshTokens WHERE id = ?', [userId]);
            //store new refreshToken in db
            await pool.execute('INSERT INTO refreshTokens SET id = ?, token = ?', [userId, refreshToken]);

            //Store cookies in browser
            res.cookie("accessToken", accessToken, accessTokenOptions);
            res.cookie("refreshToken", refreshToken, refreshTokenOptions);
            res.cookie("userId", userId)
            res.cookie("username", username)
            return res.send("You are now logged in");
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
        return res.redirect("/login");
    } catch (err) {
        return res.status(500).send(err);
    }
});

router.post("/logout", async (req, res) => {

    try {
        const refreshToken = req.body.refreshToken;
        //Sæt cookies på client.
        res.cookie("accessToken", "");
        res.cookie("refreshToken", "");
        //delete old refreshToken if it exists
        await pool.execute('DELETE FROM refreshTokens WHERE token = ?', [refreshToken]);
        return res.send("you have been loged out");

    }catch(err) {
        return res.status(500).send(err);
    }
});

module.exports = router;