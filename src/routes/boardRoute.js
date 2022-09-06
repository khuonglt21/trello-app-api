const express = require('express');
const boardController = require('../controllers/boardController');
const route = express.Router();

route.get('/:id', boardController.getById);
route.post('/:boardId/add-member', boardController.addMember);
route.get('/:id/activity', boardController.getActivityById);
route.put('/:boardId/update-board-title', boardController.updateBoardTitle);
route.put('/:boardId/update-expanded-labels', boardController.updateIsExpandedLabels);
route.put('/:boardId/delete-member', boardController.deleteMember);

module.exports = route;
