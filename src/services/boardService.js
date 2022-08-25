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

module.exports = {
    getById
};