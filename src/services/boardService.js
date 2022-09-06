const boardModel = require("../models/boardModel");
const userModel = require("../models/userModel");
const cardModel = require("../models/cardModel");
const helperMethods = require("./helperMethods");

const getById = async (id, callback) => {
    try {
        // Get board by id
        const board = await boardModel.findById(id).populate({path: "teams", select : "members"});
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
					role: 'Member',
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
const updateIsExpandedLabels = async (boardId, user, callback) => {
	try {
		// Get board by id
		const board = await boardModel.findById(boardId);
		board.isExpandedLabels = !board.isExpandedLabels;
		await board.save();
		return callback(false, { message: 'Success!' });
	} catch (error) {
		return callback({ message: 'Something went wrong', details: error.message });
	}
};

const deleteMember=async (req,callback) => {
    try {
        const board = await boardModel.findById(req.body.boardId)

		//xoa member trong board && xoa board o trong member dang bi xoa
		const memberDelete=board.members?.filter(member => member._id.toString()  === req.body.idMember)
		const user=await userModel.findById(memberDelete[0].user)
		user.boards = user?.boards.filter(board => board._id.toString() !== req.body.boardId)
		await user.save();

		board.members = board.members.filter(member => member._id.toString()  !== req.body.idMember)
		await board.save();

		//delete from all cards of board
		board.lists.map(async list => {
			const listCards = await cardModel.find({owner : list});
			listCards.map(async card => {
				// card.members.length && console.log(card.members)
				// console.log(card.members.map(member => member.user.toString() !== req.body.idMember))
				card.members = card.members.filter(member => member.user.toString() !== req.body.memberUser.toString());
				// card.members.length && console.log(card.members)
				await card.save();
			})
		});

        // Validate owner
        // const validate = await helperMethods.validateCardOwners(card, list, board, user, false);
        // if (!validate) {
        //     errMessage: 'You dont have permission to update this card';
        // }
		//

        return callback(false, { message: 'Delete Member Success!' });
    } catch (error) {
        return callback({ errMessage: 'Something went wrong', details: error.message });
    }


}
module.exports = {
    getById,
    addMember,
	getActivityById,
	updateBoardTitle,
	updateIsExpandedLabels,
	deleteMember
};