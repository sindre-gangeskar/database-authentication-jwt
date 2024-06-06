const express = require('express');
const router = express.Router();
const jsend = require('jsend');
const db = require('../models');
const ResultService = require('../services/ResultService');
const resultService = new ResultService(db);
const jwt = require('jsonwebtoken');

router.use(jsend.middleware);
router.get('/add/:number1', async function (req, res, next) {
    //#region Swagger Setup
    /* 
        #swagger.tags = ['Previous Add']
        #swagger.description = "Pass in number1 in the endpoint and get sum back as an addition with the use of the previous number passed in - must be logged in"
    */
    //#endregion
    const number1 = parseInt(req.params.number1);
    if (isNaN(number1)) return res.jsend.fail({ number1: 'number1 is not in correct format' });

    const token = req.headers.authorization?.split(' ')[ 1 ];
    if (!token) return res.jsend.fail({ result: 'JWT token is invalid' });

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (error) {
        return res.jsend.fail({ result: error });
    }

    const previous = await resultService.getOne(decodedToken.id);
    const result = previous.Value + number1;
    resultService.create('add', result, decodedToken.id);
    console.log(decodedToken);
    if (previous.Value % decodedToken.email.length === 0)
        return res.jsend.success('You are lucky');

    return res.jsend.success({ result: result, previousOperation: previous.OperationName, previousValue: previous.Value });
})

router.get('/subtract/:number1', async function (req, res, next) {
    //#region Swagger Setup
    /* 
        #swagger.tags = ['Previous Subtract']
        #swagger.description = "Pass in number1 in the endpoint and get sum back as a subtraction with the use of the previous number passed in - must be logged in"
    */
    //#endregion
    const number1 = parseInt(req.params.number1);
    if (isNaN(number1)) return res.jsend.fail({ number1: 'number1 is not in correct format' });

    const token = req.headers.authorization?.split(' ')[ 1 ];
    if (!token) return res.jsend.fail('JWT token is invalid');

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (error) {
        return res.jsend.fail({ result: error });
    }

    const previous = await resultService.getOne(decodedToken.id);
    const result = previous.Value - number1;
    resultService.create('subtract', result, decodedToken.id);
    res.jsend.success({ result: result, previousOperation: previous.OperationName, previousValue: previous.Value });
})
router.get('/multiply/:number1', async function (req, res, next) {
    //#region Swagger Setup
    /* 
        #swagger.tags = ['Previous Multiply']
        #swagger.description = "Pass in number1 in the endpoint and get sum back as an multiplication with the use of the previous number passed in - must be logged in"
    */
    //#endregion
    const number1 = parseInt(req.params.number1);
    if (isNaN(number1)) return res.jsend.fail({ number1: 'number1 is not in correct format' });

    const token = req.headers.authorization?.split(' ')[ 1 ];
    if (!token) return res.jsend.fail('JWT token is invalid');

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (error) {
        return res.jsend.fail({ result: error });
    }

    const previous = await resultService.getOne(decodedToken.id);
    const result = previous.Value * number1;
    resultService.create('multiply', result, decodedToken.id);
    res.jsend.success({ result: result, previousOperation: previous.OperationName, previousValue: previous.Value });
})
router.get('/divide/:number1', async function (req, res, next) {
    //#region Swagger Setup
    /* 
        #swagger.tags = ['Previous Divide']
        #swagger.description = "Pass in number1 in the endpoint and get sum back as a division with the use of the previous number passed in - must be logged in"
    */
    //#endregion
    const number1 = parseInt(req.params.number1);
    if (isNaN(number1)) return res.jsend.fail({ number1: 'number1 is not in correct format' });

    const token = req.headers.authorization?.split(' ')[ 1 ];
    if (!token) return res.jsend.fail('JWT token is invalid');

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (error) {
        return res.jsend.fail({ result: error });
    }

    const previous = await resultService.getOne(decodedToken.id);
    const result = previous.Value / number1;
    resultService.create('divide', result, decodedToken.id);
    if (Number.isInteger(result)) {
        res.jsend.success({ "result": result, "previousOperation": previous.OperationName, "previousValue": previous.Value });
    }
    else {
        res.jsend.success({ "result": Math.round(result), "previousOperation": previous.OperationName, "previousValue": previous.Value, "message": "Result has been rounded, as it was not an integer." });
    }
})


module.exports = router;