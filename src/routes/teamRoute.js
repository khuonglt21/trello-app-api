const express = require('express');
const teamController = require('../controllers/teamController');
const route = express.Router();



route.post('/create', teamController.createTeam);
route.get('/', teamController.getTeams);


module.exports = route;
