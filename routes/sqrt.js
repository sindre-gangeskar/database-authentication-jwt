const express = require('express');
const router = express();
const jsend = require('jsend');

const db = require('../models');
const ResultService = require('../services/ResultService');
const resultService = new ResultService(db);
const jwt = require('jsonwebtoken');

router.use(jsend.middleware);
router.get('/:number1?', function (req, res, next) {
    //#region Swagger Setup
    /* 
        #swagger.tags = ['Sqaure Root']
        #swagger.description = "Pass in number1 in the endpoint and get sum back as a square root of the number passed in"
    */
    //#endregion
    const { number1 } = req.params;

    if (!number1)
        return res.jsend.fail('Need two values, e.g sqrt/2');

    if (isNaN(number1))
        return res.jsend.fail({ number1: 'number1 is not in correct format' });

    const result = Math.sqrt(parseInt(number1));
    const token = req.headers.authorization?.split(' ')[ 1 ];
    if (token) {
        try {
            const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
            resultService.create('sqrt', result, decodedToken.id);
        } catch (error) {
            return res.jsend.success({ result: result, message: error });
        }

    }
    if (Number.isInteger(result))
        return res.jsend.success(result);

    else return res.jsend.success({ result: Math.round(result), message: 'Result was not an integer and has been rounded to be one' })
})

module.exports = router;