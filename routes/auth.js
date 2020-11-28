const router = require('express').Router();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');



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

router.post("/login", (req, res) => {
    return res.status(501).send();
});

router.post("/register", async (req, res) => {
    try {
        const username = req.body.username;
        const email = req.body.email;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        await pool.execute('INSERT INTO users SET username = ?, password = ?, email = ?', [username, hashedPassword, email]);
        res.redirect("/index");

    } catch (err) {
        res.status(500).send(err)
    }
});

router.get("/logout", (req, res) => {
    return res.status(501).send();
});

module.exports = router;