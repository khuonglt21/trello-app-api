const express = require('express');
const boardController = require('../controllers/boardController');
const route = express.Router();


route.get('/:id', boardController.getById);
route.post('/:boardId/add-member', boardController.addMember);
route.get('/:id/activity', boardController.getActivityById);
route.put('/:boardId/update-board-title', boardController.updateBoardTitle);



module.exports = route;
