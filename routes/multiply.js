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
        #swagger.tags = ['Multiply']
        #swagger.description = "Pass in number1 and number2 in the endpoint and get sum back as a multiplication of the two numbers passed in"
    */
    //#endregion
    const { number1, number2 } = req.params;
    const result = parseInt(number1) * parseInt(number2);
    if (!number1 || !number2)
        return res.jsend.fail('Need two values, e.g multiply/2/2');

    if (isNaN(number1))
        return res.jsend.fail({ number1: 'number1 is not in correct format' });

    if (isNaN(number2))
        return res.jsend.fail({ number2: 'number2 is not in correct format' });

    const token = req.headers.authorization?.split(' ')[ 1 ];
    if (token) {
        try {
            const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
            resultService.create('multiply', result, decodedToken.id);
        } catch (error) {
            return res.jsend.success({ result: result, message: error });
        }

    }

    return res.jsend.success(result);
})

module.exports = router;