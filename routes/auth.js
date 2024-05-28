const express = require('express');
const router = express.Router();
const jsend = require('jsend');
const crypto = require('node:crypto');
const jwt = require('jsonwebtoken');

const db = require('../models');
const UserService = require('../services/UserService');
const userService = new UserService(db);

router.use(jsend.middleware);
router.post('/signup', async function (req, res, next) {
    const { Name, Email, Password } = req.body;
    const salt = crypto.randomBytes(16);

    crypto.pbkdf2(Password, salt, 310000, 32, 'sha256', function (err, hashedPassword) {
        if (err) return next(err);
        userService.create(Name, Email, hashedPassword, salt);
        res.jsend.success({ result: 'Successfully created account' });
    })
})
router.post('/login', async function (req, res, next) {
    try {
        const { Email, Password } = req.body;
        const data = await userService.getOne(Email);

        if (!data) {
            return res.jsend.fail({ message: `Could not find user account with email: ${Email}` });
        }

        crypto.pbkdf2(Password, data.Salt, 310000, 32, 'sha256', function (err, hashedPassword) {
            if (err) return res.jsend.fail('Error hasing password');

            if (!crypto.timingSafeEqual(data.EncryptedPassword, hashedPassword))
                return res.jsend.fail('Incorrect username or password');

            try {
                let token = jwt.sign({
                    id: data.id, email: data.Email
                }, process.env.TOKEN_SECRET, { expiresIn: '1hr' });
                return res.jsend.success({ result: 'You are logged in!', id: data.id, email: data.Email, token: token });
            } catch (error) { return res.jsend.error({ message: 'An error has occurred while trying to create JWT', code: 500 }) }
        })
    } catch (error) {
        res.jsend.error({ message: 'Internal server error', code: 500 })
    }
})

module.exports = router;