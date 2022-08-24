const express = require('express');
const boardController = require('../controllers/boardController');
const route = express.Router();


route.get('/:id', boardController.getById);
route.post('/create', boardController.create);
route.get('/', boardController.getAll);


module.exports = route;
