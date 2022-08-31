const boardService = require('../services/boardService');
const cardService = require("../services/cardService");

const getById = async (req, res) => {
    // Validate whether params.id is in the user's boards or not
    const validate = req.user.boards.filter((board) => board === req.params.id);
    if (!validate)
        return res.status(400).send({errMessage: 'You can not show the this board, you are not a member or owner!'});

    // Call the service
    await boardService.getById(req.params.id, (err, result) => {
        if (err) return res.status(400).send(err);
        return res.status(200).send(result);
    });
};

const addMember = async (req, res) => {
	// Validate whether params.id is in the user's boards or not
	const validate = req.user.boards.filter((board) => board === req.params.id);
	if (!validate)
		return res
			.status(400)
			.send({ errMessage: 'You can not add member to this board, you are not a member or owner!' });
	const { boardId } = req.params;
	const { members } = req.body;
	// Call the service
	await boardService.addMember(boardId, members, req.user, (err, result) => {
		if (err) return res.status(400).send(err);
		return res.status(200).send(result);
	});
};

const getActivityById = async (req, res) => {
	// Validate whether params.id is in the user's boards or not
	const validate = req.user.boards.filter((board) => board === req.params.id);
	if (!validate)
		return res.status(400).send({ errMessage: 'You can not show the this board, you are not a member or owner!' });

	// Call the service
	await boardService.getActivityById(req.params.id, (err, result) => {
		if (err) return res.status(400).send(err);
		return res.status(200).send(result);
	});
};

const updateBoardTitle = async (req, res) => {
	// Validate whether params.id is in the user's boards or not
	const validate = req.user.boards.filter((board) => board === req.params.id);
	if (!validate)
		return res
			.status(400)
			.send({ errMessage: 'You can not change title of this board, you are not a member or owner!' });
	const { boardId } = req.params;
	const { title } = req.body;
	// Call the service
	await boardService.updateBoardTitle(boardId, title, req.user, (err, result) => {
		if (err) return res.status(400).send(err);
		return res.status(200).send(result);
	});
};
const updateIsExpandedLabels = async (req, res) => {
	// Validate whether params.id is in the user's boards or not
	const validate = req.user.boards.filter((board) => board === req.params.id);
	if (!validate)
		return res
			.status(400)
			.send({ errMessage: 'You can not change title of this board, you are not a member or owner!' });
	const { boardId } = req.params;
	// Call the service
	await boardService.updateIsExpandedLabels(boardId, req.user, (err, result) => {
		if (err) return res.status(400).send(err);
		return res.status(200).send(result);
	});
};

const deleteMember = async (req, res) => {

	// Get params
	// const user = req.user;
	// const { boardId, listId, cardId, commentId } = req.params;

	// Call the card service
	await boardService.deleteMember(req, (err, result) => {
		if (err) return res.status(500).send(err);
		return res.status(200).send(result);
	});
};




module.exports = {
    getById,
    addMember,
	getActivityById,
	updateBoardTitle,
	updateIsExpandedLabels,
	deleteMember
};