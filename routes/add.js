const express = require('express');
const router = express();
const jsend = require('jsend');

const db = require('../models');
const ResultService = require('../services/ResultService');
const resultService = new ResultService(db);
const jwt = require('jsonwebtoken');

router.use(jsend.middleware);
router.get('/:number1?/:number2?', function (req, res, next) {
    const { number1, number2 } = req.params;

    if (!number1 || !number2)
        return res.jsend.fail('Need two values, e.g add/2/2');

    if (isNaN(number1))
        return res.jsend.fail({ number1: 'number1 is not in correct format' });

    if (isNaN(number2))
        return res.jsend.fail({ number2: 'number2 is not in correct format' });

    const result = parseInt(number1) + parseInt(number2);
    const token = req.headers.authorization?.split(' ')[ 1 ];
    if (token) {
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        resultService.create('add', result, decodedToken.id);
    }
    
    return res.jsend.success(result);
});

module.exports = router;