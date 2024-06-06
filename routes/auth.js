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
    //#region Swagger Setup
    /* 
    #swagger.tags = ['Users']
    #swagger.description = "Sign up with email, password and name"
    */
    //#endregion
    try {
        const { Name, Email, Password } = req.body;
        const salt = crypto.randomBytes(16);

        if (!Name) return res.jsend.error('Name is required for signup');
        if (!Email) return res.jsend.error('Email is required for signup')
        if (!Password) return res.jsend.error('Password is required for signup');

        crypto.pbkdf2(Password, salt, 310000, 32, 'sha256', async function (err, hashedPassword) {
            if (err) return next(err);
            try {
                await userService.create(Name, Email, hashedPassword, salt);
                return res.jsend.success({ result: 'Successfully created account' });
            } catch (error) {
                if (error.message === 'Validation error') return res.jsend.error('An account associated with this email already exists, please use another email and try again');
                return res.jsend.error(error);
            }
        })
    } catch (error) {
        return res.jsend.error(error);
    }
})


router.post('/login', async function (req, res, next) {
    //#region Swagger Setup
    /*
    #swagger.tags = ['Users']
    #swagger.description = "Attempt to login with email and password - success is signed a JSON Web Token"
    */
    //#endregion
    try {
        const { Email, Password } = req.body;
        const data = await userService.getOne(Email);

        if (!data) return res.jsend.fail(`Could not find user account with email: ${Email}`);
        if (!Password) return res.jsend.fail('Password is required');

        crypto.pbkdf2(Password, data.Salt, 310000, 32, 'sha256', function (err, hashedPassword) {
            if (err) return res.jsend.fail('Error hashing password');

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
        res.jsend.error(error)
    }
})

router.delete('/', async function (req, res, next) {
    const { Email } = req.body;
    if (!Email) return res.jsend.fail({ Email: 'Email is required' });
    const user = await userService.getOne(Email);
    
    if (!user) return jsend.fail({ Email: 'No such user in the database' });
    await userService.delete(Email);
    return res.jsend.success({ result: 'Successfully deleted account', account: Email });
})

module.exports = router;