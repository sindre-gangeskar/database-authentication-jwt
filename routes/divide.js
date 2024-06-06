const express = require('express');
const router = express();
const jsend = require('jsend');

const db = require('../models');
const ResultService = require('../services/ResultService');
const resultService = new ResultService(db);
const jwt = require('jsonwebtoken');

router.use(jsend.middleware);
router.get('/:number1?/:number2?', function (req, res, next) {
    //#region Swagger Setup
    /* 
        #swagger.tags = ['Divide']
        #swagger.description = "Pass in number1 and number2 in the endpoint and get sum back as a division of the two numbers passed in"
    */
    //#endregion
    const { number1, number2 } = req.params;

    if (!number1 || !number2)
        return res.jsend.fail('Need two values, e.g divide/2/2');

    if (isNaN(number1))
        return res.jsend.fail({ number1: 'number1 is not in correct format' });

    if (isNaN(number2))
        return res.jsend.fail({ number2: 'number2 is not in correct format' });

    if (number1 == 0 || number2 == 0)
        return res.jsend.fail({ number1: number1, number2: number2, message: 'Cannot divide by zero' });

    const result = number1 / number2;
    const token = req.headers.authorization?.split(' ')[ 1 ];
    if (token) {
        try {
            const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
            resultService.create('divide', result, decodedToken.id);
        } catch (error) {
            return res.jsend.success({ result: result, message: error });
        }

    }
    if (Number.isInteger(result))
        return res.jsend.success(parseInt(number1) / parseInt(number2));

    else res.jsend.success({ result: Math.round(parseInt(result)), message: 'Result was not an integer and has been rounded to be one' })
})

module.exports = router;