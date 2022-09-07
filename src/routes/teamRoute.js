const express = require('express');
const teamController = require('../controllers/teamController');
const route = express.Router();



route.post('/create', teamController.createTeam);
route.post('/create-boards', teamController.createBoardInTeam);

route.get('/', teamController.getTeams);
route.get('/:idTeam', teamController.getTeam);
route.get('/getAll', teamController.getAllTeams);
route.post('/change-role', teamController.changeRoleTeam);
route.post('/invite', teamController.inviteMember);
route.post('/remove-member', teamController.removeMember);
route.put('/change-role-user', teamController.changeRoleUserTeam);



module.exports = route;
