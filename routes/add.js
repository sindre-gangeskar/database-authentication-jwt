const express = require('express');
const router = express();
const jsend = require('jsend');

const db = require('../models');
const ResultService = require('../services/ResultService');
const resultService = new ResultService(db);
const jwt = require('jsonwebtoken');

router.use(jsend.middleware);
router.get('/:number1?/:number2?', function (req, res, next) {
  /* 
      #swagger.tags = ['Add']
    #swagger.description = 'Add two numbers'
    #swagger.parameters['number1'] = {
      in: 'path',
      required: true,
      type: 'integer',
      description: 'First number',
      example: 1
    }
    #swagger.parameters['number2'] = {
      in: 'path',
      required: true,
      type: 'integer',
      description: 'Second number',
      example: 2
    }
    #swagger.parameters['authorization'] = {
      in: 'header',
      required: false,
      type: 'string',
      description: 'Authorization token'
    }
    #swagger.responses[200] = {
      description: 'OK',
      schema: {
        type: 'object',
        properties: {
          result: { type: 'integer', example: 3 }
        }
      }
    }
    #swagger.responses[400] = {
      description: 'Bad request',
      schema: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'fail' },
          data: { type: 'string', example: 'Need two values, e.g add/1/2' }
        }
      }
    }
  */
  const { number1, number2 } = req.params;
  if (req.params.length < 2)
    return res.jsend.fail('BOO');

  if (!number1 || !number2)
    return res.jsend.fail('Need two values, e.g add/2/2');

  if (isNaN(number1))
    return res.jsend.fail({ number1: 'number1 is not in correct format' });

  if (isNaN(number2))
    return res.jsend.fail({ number2: 'number2 is not in correct format' });

  const result = parseInt(number1) + parseInt(number2);
  const token = req.headers.authorization?.split(' ')[ 1 ];
  if (token) {
    try {
      const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
      resultService.create('add', result, decodedToken.id);
    } catch (error) {
      return res.jsend.success({ result: result, message: error });
    }
  }

  return res.jsend.success(result);
});

module.exports = router;