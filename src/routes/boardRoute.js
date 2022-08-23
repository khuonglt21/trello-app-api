const express = require('express');
const boardController = require('../controllers/boardController');
const route = express.Router();


route.get('/:id', boardController.getById);


module.exports = route;
