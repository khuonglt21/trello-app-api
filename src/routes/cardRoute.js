const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController')


router.post('/create', cardController.create);
router.get('/:boardId/:listId/:cardId', cardController.getCard);
router.put('/:boardId/:listId/:cardId', cardController.update);
router.put('/:boardId/:listId/:cardId/:labelId/update-label', cardController.updateLabel);
router.put('/:boardId/:listId/:cardId/:labelId/update-label-selection', cardController.updateLabelSelection);
router.post('/:boardId/:listId/:cardId/create-label', cardController.createLabel);
router.post('/:boardId/:listId/:cardId',cardController.insertAttachmentsCard)


module.exports = router;