const router = require('express').Router();
const nodemailer = require('nodemailer');

router.post('/contactForm', (req, res) => {
    const getEmail = req.body.email;
    const getSubject = req.body.subject;    
    const getContent = req.body.content; 

    const output = `
        <h3>Contact Information</h3>
        <ul>
            <li>From: ${req.body.email}</li>
            <li>Name: ${req.body.name}</li>
            <li>Subject: ${req.body.subject}</li>
        </ul>
        <h3>Content</h3>
        <p>${req.body.content}</p>
        `;

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        service: 'gmail',
        secure: false, 
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }, 
        tls: {
            rejectUnauthorized:false
        }
    });

    const mailOptions = {
        from: getEmail,
        to: process.env.EMAIL,
        subject: getSubject, 
        content: getContent,
        html: output
    };

    transporter.sendMail(mailOptions, (err, data) => {
        if(err){
            console.log(`Error: ${err}`);
            res.status(401).send('Email not sent');
        } else {
            res.status(200).send('Email sent');
        }
    });

    console.log(req.body);
});


module.exports = router;