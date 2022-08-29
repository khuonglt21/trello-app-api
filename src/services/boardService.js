const boardModel = require("../models/boardModel");
const userModel = require("../models/userModel");

const getById = async (id, callback) => {
    try {
        // Get board by id
        const board = await boardModel.findById(id);
        return callback(false, board);
    } catch (error) {
        return callback({ message: 'Something went wrong', details: error.message });
    }
};

const addMember = async (id, members, user, callback) => {
	try {
		// Get board by id
		const board = await boardModel.findById(id);

		// Set variables
		await Promise.all(
			members.map(async (member) => {
				const newMember = await userModel.findOne({ email: member.email });
				newMember.boards.push(board._id);
				await newMember.save();
				board.members.push({
					user: newMember._id,
					name: newMember.name,
					surname: newMember.surname,
					email: newMember.email,
					color: newMember.color,
					avatar: newMember.avatar,
					role: 'member',
				});
				//Add to board activity
				board.activity.push({
					user: user.id,
					name: user.name,
					action: `added user '${newMember.name}' to this board`,
					color: user.color,
				});
			})
		);
		// Save changes
		await board.save();

		return callback(false, board.members);
	} catch (error) {
		return callback({ message: 'Something went wrong', details: error.message });
	}
};

const getActivityById = async (id, callback) => {
	try {
		// Get board by id
		const board = await boardModel.findById(id);
		return callback(false, board.activity);
	} catch (error) {
		return callback({ message: 'Something went wrong', details: error.message });
	}
};

const updateBoardTitle = async (boardId, title, user, callback) => {
	try {
		// Get board by id
		const board = await boardModel.findById(boardId);
		board.title = title;
		board.activity.unshift({
			user: user._id,
			name: user.name,
			action: 'update title of this board',
			color: user.color,
		});
		await board.save();
		return callback(false, { message: 'Success!' });
	} catch (error) {
		return callback({ message: 'Something went wrong', details: error.message });
	}
};

module.exports = {
    getById,
    addMember,
	getActivityById,
	updateBoardTitle,
};