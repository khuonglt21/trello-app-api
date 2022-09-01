const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController')


router.post('/create', cardController.create);
router.get('/:boardId/:listId/:cardId', cardController.getCard);
router.put('/:boardId/:listId/:cardId', cardController.update);
router.put('/:boardId/:listId/:cardId/:labelId/update-label', cardController.updateLabel);
router.put('/:boardId/:listId/:cardId/:labelId/update-label-selection', cardController.updateLabelSelection);
router.post('/:boardId/:listId/:cardId/create-label', cardController.createLabel);
router.post('/:boardId/:listId/:cardId/add-comment', cardController.addComment);
router.delete('/:boardId/:listId/:cardId/:commentId', cardController.deleteComment);
router.put('/:boardId/:listId/:cardId/:commentId', cardController.updateComment);
router.delete('/:boardId/:listId/:cardId/:labelId/delete-label', cardController.deleteLabel);
router.delete('/attachment/:boardId/:listId/:cardId/:attachmentId',cardController.deleteAttachmentCard)
router.post('/:boardId/:listId/:cardId', cardController.insertAttachmentsCard)
router.put('/attachment/:boardId/:listId/:cardId/:attachmentId',cardController.attachmentUpdate)

module.exports = router;