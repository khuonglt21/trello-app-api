const cardService = require('../services/cardService');


const create = async (req, res) => {
    // get infor from req.body
    const {title, listId, boardId} = req.body;
    const user = req.user;

    // validate the inputs
    if(!(title && listId && boardId)) {
        return res
            .status(400)
            .send({errMessage: "Missing information"});

    }
    // Call card service
    	await cardService.create(title, listId, boardId, user, (err, result) => {
    		if (err) return res.status(500).send(err);
    		return res.status(201).send(result);
    	});
}


module.exports = {
    create,

}