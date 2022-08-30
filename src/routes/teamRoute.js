const express = require('express');
const teamController = require('../controllers/teamController');
const route = express.Router();



route.post('/create', teamController.createTeam);
route.post('/create-boards', teamController.createBoardInTeam);

route.get('/', teamController.getTeams);


module.exports = route;
