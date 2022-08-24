const express = require('express');
const boardsController = require('../controllers/boardsController');
const route = express.Router();


route.post('/create', boardsController.create);
// get list of user
route.get('/', boardsController.getAll);
//get all


module.exports = route;