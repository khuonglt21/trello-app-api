const cardModel = require('../models/cardModel');
const listModel = require('../models/listModel');
const boardModel = require('../models/boardModel');
const userModel = require('../models/userModel');
const helperMethods = require('./helperMethods');
const fs = require('fs');

const create = async (title, listId, boardId, user, callback) => {
    try {
        // Get list and board
        const list = await listModel.findById(listId);
        const board = await boardModel.findById(boardId);

        // Validate the ownership
        const validate = await helperMethods.validateCardOwners(null, list, board, user, true);
        if (!validate) return callback({errMessage: 'You dont have permission to add card to this list or board'});

        // Create new card
        const card = await cardModel({title: title});
        card.owner = listId;
        card.activities.unshift({text: `added this card to ${list.title}`, userName: user.name, color: user.color});
        card.labels = board.labels;
        await card.save();

        // Add id of the new card to owner list
        list.cards.push(card._id);
        await list.save();

        // Add log to board activity
        board.activity.unshift({
            user: user._id,
            name: user.name,
            action: `added ${card.title} to this board`,
            color: user.color,
        });

        // board.labels = helperMethods.labelsSeed;
        await board.save();

        // Set data transfer object
        const result = await listModel.findById(listId).populate({path: 'cards'}).exec();
        return callback(false, result);
    } catch (error) {
        return callback({errMessage: 'Something went wrong', details: error.message});
    }
};

const getCard = async (cardId, listId, boardId, user, callback) => {
    try {
        // Get models
        const card = await cardModel.findById(cardId);
        const list = await listModel.findById(listId);
        const board = await boardModel.findById(boardId);


        // Validate owner
        const validate = await helperMethods.validateCardOwners(card, list, board, user, false);
        if (!validate) return callback({
            errMessage: 'You dont have permission to update this card',
        });
        // for (let i = 0; i < board.labels.length; i++) {
        //     let label= false;
        //     for (let j = 0; j < card.labels.length; j++) {
        //         if(board.labels[i].text === card.labels[j].text){
        //             if(board.labels[i].color === card.labels[j].color){
        //                 if(board.labels[i]._id.toString() === card.labels[j]._id.toString()){
        //                     label = true;
        //                     break;
        //                 }else{
        //
        //                 }
        //
        //             }
        //         }
        //     }
        //     // if(label === false){
        //     //     card.labels.push(board.labels[i]);
        //     // }
        // }
        await card.save();

        let returnObject = {...card._doc, listTitle: list.title, listId: listId, boardId: boardId};

        return callback(false, returnObject);
    } catch (error) {
        return callback({errMessage: 'Something went wrong', details: error.message});
    }
};

const update = async (cardId, listId, boardId, user, updatedObj, callback) => {
    try {
        // Get models
        const card = await cardModel.findById(cardId);
        const list = await listModel.findById(listId);
        const board = await boardModel.findById(boardId);

        // Validate owner
        const validate = await helperMethods.validateCardOwners(card, list, board, user, false);
        if (!validate) return callback({
            errMessage: 'You dont have permission to update this card'
        })

        //Update card
        await card.updateOne(updatedObj);
        await card.save();

        return callback(false, {message: 'Success!'});
    } catch (error) {
        return callback({errMessage: 'Something went wrong', details: error.message});
    }
};

const updateLabel = async (cardId, listId, boardId, labelId, user, label, callback) => {
    try {
        // Get models
        const card = await cardModel.findById(cardId);
        const list = await listModel.findById(listId);
        const board = await boardModel.findById(boardId);

        // Validate owner
        const validate = await helperMethods.validateCardOwners(card, list, board, user, false);
        if (!validate) {
            errMessage: 'You dont have permission to update this card';
        }
        //Update label
        card.labels = card.labels.map((item) => {
            if (item._id.toString() === labelId.toString()) {
                item.text = label.text;
                item.color = label.color;
                item.backColor = label.backColor;
            }
            return item;
        });
        await card.save();
        board.labels = board.labels.map((item) => {
            if (item._id.toString() === labelId.toString()) {
                item.text = label.text;
                item.color = label.color;
                item.backColor = label.backColor;
                item.selected = false;
            }
            return item;
        });
        await board.save();

        return callback(false, { message: 'Success!' });
    } catch (error) {
        return callback({errMessage: 'Something went wrong', details: error.message});
    }
};

const updateLabelSelection = async (cardId, listId, boardId, labelId, user, selected, callback) => {
    try {
        // Get models
        const card = await cardModel.findById(cardId);
        const list = await listModel.findById(listId);
        const board = await boardModel.findById(boardId);

        // Validate owner
        const validate = await helperMethods.validateCardOwners(card, list, board, user, false);
        if (!validate) {
            errMessage: 'You dont have permission to update this card';
        }


        //Update label
        card.labels = card.labels.map((item) => {
            if (item._id.toString() === labelId.toString()) {
                item.selected = selected;
            }
            return item;
        });
        await card.save();

        return callback(false, card);
    } catch (error) {
        return callback({ errMessage: 'Something went wrong', details: error.message });
    }
};
const createLabel = async (cardId, listId, boardId, user, label, callback) => {
    try {
        // Get models
        const card = await cardModel.findById(cardId);
        const list = await listModel.findById(listId);
        const board = await boardModel.findById(boardId);

        // Validate owner
        const validate = await helperMethods.validateCardOwners(card, list, board, user, false);
        if (!validate) {
            errMessage: 'You dont have permission to add label this card';
        }

        //Add label
        card.labels.unshift({
            text: label.text,
            color: label.color,
            backcolor: label.backColor,
            selected: true,
        });
        await card.save();
        board.labels.unshift({
            _id : card.labels[0]._id,
            text: label.text,
            color: label.color,
            backcolor: label.backColor,
            selected: false,
        });
        await board.save();

        const labelId = card.labels[0]._id;

        return callback(false, { labelId: labelId, card: card });
    } catch (error) {
        return callback({ errMessage: 'Something went wrong', details: error.message });
    }
};

const deleteLabel = async (cardId, listId, boardId, labelId, user, callback) => {
    try {
        // Get models
        const card = await cardModel.findById(cardId);
        const list = await listModel.findById(listId);
        const board = await boardModel.findById(boardId);
        const allCard = await cardModel.find({owner: list._id });


        // Validate owner
        const validate = await helperMethods.validateCardOwners(card, list, board, user, false);
        if (!validate) {
            errMessage: 'You dont have permission to delete this label';
        }

        //Delete label
        card.labels = card.labels.filter((label) => label._id.toString() !== labelId.toString());
        await card.save();
        board.labels = board.labels.filter((label) => label._id.toString() !== labelId.toString())
        await board.save();

        return callback(false, { message: 'Success!' });
    } catch (error) {
        return callback({ errMessage: 'Something went wrong', details: error.message });
    }
};

const uploadFile = async (cardId, file, callback) => {
    try {
        // const card = await cardModel.updateOne(cardId, {
        //     $push: {
        //         attachments: {
        //             link: file,
        //             name: file
        //         }
        //     }
        // })
        const card = await cardModel.findById(cardId);
        card.attachments.push( {
                       link: file,
                       name: file
                    });
        card.save();
        return callback(false,card)
    } catch (e) {
        return callback({errMessage: 'Something went wrong', details: e.message})
    }
};
const addAttachmentToCard = async(cardId,listId,boardId,user,linkName,link,callback) =>{
    try{
        // Get models
        const card = await cardModel.findById(cardId);
        const list = await listModel.findById(listId);
        const board = await boardModel.findById(boardId);

        // Validate owner
        const validate = await helperMethods.validateCardOwners(card, list, board, user, false);
        if (!validate) {
          return callback({errMessage: 'You dont have permission to add label this card'})
        }
        card.attachments.push( {
            link: link,
            name: linkName
        });
        card.save();
        return callback(false,card)
    }catch (e) {
        callback(true,{errMessage: 'Something went wrong', details: e.message})
    }
}
const addComment = async (cardId, listId, boardId, user, body, callback) => {
    try {
        // Get models
        const card = await cardModel.findById(cardId);
        const list = await listModel.findById(listId);
        const board = await boardModel.findById(boardId);

        // Validate owner
        const validate = await helperMethods.validateCardOwners(card, list, board, user, false);
        if (!validate) {
            errMessage: 'You dont have permission to update this card';
        }

        //Add comment
        card.activities.unshift({
            text: body.text,
            userName: user.name,
            isComment: true,
            color: user.color,
        });
        await card.save();

        //Add comment to board activity
        board.activity.unshift({
            user: user._id,
            name: user.name,
            action: body.text,
            actionType: 'comment',
            cardTitle: card.title,
            color: user.color,
        });
        await board.save();

        return callback(false, card.activities);
    } catch (error) {
        return callback({ errMessage: 'Something went wrong', details: error.message });
    }
};

const deleteComment = async (cardId, listId, boardId, commentId, user, callback) => {
    try {
        // Get models
        const card = await cardModel.findById(cardId);
        const list = await listModel.findById(listId);
        const board = await boardModel.findById(boardId);

        // Validate owner
        const validate = await helperMethods.validateCardOwners(card, list, board, user, false);
        if (!validate) {
            errMessage: 'You dont have permission to update this card';
        }

        //Delete card
        card.activities = card.activities.filter((activity) => activity._id.toString() !== commentId.toString());
        await card.save();

        //Add to board activity
        board.activity.unshift({
            user: user._id,
            name: user.name,
            action: `deleted his/her own comment from ${card.title}`,
            color: user.color,
        });
        await board.save();

        return callback(false, { message: 'Success!' });
    } catch (error) {
        return callback({ errMessage: 'Something went wrong', details: error.message });
    }
};

const updateComment = async (cardId, listId, boardId, commentId, user, body, callback) => {
    try {
        // Get models
        const card = await cardModel.findById(cardId);
        const list = await listModel.findById(listId);
        const board = await boardModel.findById(boardId);

        // Validate owner
        const validate = await helperMethods.validateCardOwners(card, list, board, user, false);
        if (!validate) {
            errMessage: 'You dont have permission to update this card';
        }

        //Update card
        card.activities = card.activities.map((activity) => {
            if (activity._id.toString() === commentId.toString()) {
                if (activity.userName !== user.name) {
                    return callback({ errMessage: "You can not edit the comment that you hasn't" });
                }
                activity.text = body.text;
            }
            return activity;
        });
        await card.save();

        //Add to board activity
        board.activity.unshift({
            user: user._id,
            name: user.name,
            action: `update comment to ${body.text}`,
            actionType: 'comment',
            edited: true,
            color: user.color,
            cardTitle: card.title,
        });
        await board.save();

        return callback(false, {message: 'Success!'});
    } catch (error) {
        return callback({errMessage: 'Something went wrong', details: error.message});
    }
};

const deleteAttachmentCard = async (cardId, listId, boardId, attachmentId, user, callback) => {
    try {
        const card = await cardModel.findById(cardId);
        const list = await listModel.findById(listId);
        const board = await boardModel.findById(boardId);
        // Validate owner
        const validate = await helperMethods.validateCardOwners(card, list, board, user, false);
        if (!validate) {
            return callback({errMessage: 'You dont have permission to delete label this card'})
        }
        //delete file
        const fileLink =await card.attachments.filter(attachment => attachment._id.toString() === attachmentId.toString())
        const httpREGEX = new RegExp('http:')
        if(!httpREGEX.test(fileLink[0].link)){
          await fs.unlink('./src/public/cards/'+fileLink[0].link,(err,result)=>{
              if (err) {
                  console.log(err);}
          })
        }
        //delete attachments
        card.attachments = card.attachments.filter(attachment => attachment._id.toString() !== attachmentId.toString())
        card.save()
        // console.log(card.attachments)
        return callback(false, {card})
    } catch (error) {
        return callback({errMessage: 'Something went wrong', details: error.message});
    }
}

const updateAttachmentCard = async (cardId, listId, boardId,attachmentId,user,link,linkName,check,callback) =>{
    try{
        const card = await cardModel.findById(cardId);
        const list = await listModel.findById(listId);
        const board = await boardModel.findById(boardId);
        // Validate owner
        const validate = await helperMethods.validateCardOwners(card, list, board, user, false);
        if (!validate) {
            return callback({errMessage: 'You dont have permission to update attachment this card'})
        }
        if(check){
            card.attachments = card.attachments.map(attachment =>{
                if(attachment._id.toString() === attachmentId.toString()){
                    attachment.link = link;
                    attachment.name = linkName;
                }
                return attachment;
                }
            )
            await card.save()
        }else{
            card.attachments = card.attachments.map(attachment =>{
                    if(attachment._id.toString() === attachmentId.toString()){
                        attachment.name = linkName;
                    }
                return attachment;
                }
            )
            await card.save()
        }
        return callback(false, {card})
    }catch(error){
        return callback({errMessage: 'Something went wrong', details: error.message});
    }
}

const addMember = async (cardId, listId, boardId, user, memberId, callback) => {
    try {
        // Get models
        const card = await cardModel.findById(cardId);
        const list = await listModel.findById(listId);
        const board = await boardModel.findById(boardId);
        const member = await userModel.findById(memberId);

        // Validate owner
        const validate = await helperMethods.validateCardOwners(card, list, board, user, false);
        if (!validate) {
            errMessage: 'You dont have permission to add member this card';
        }

        //Add member
        card.members.unshift({
            user: member._id,
            name: member.name,
            color: member.color,
        });
        await card.save();

        //Add to board activity
        board.activity.unshift({
            user: user._id,
            name: user.name,
            action: `added '${member.name}' to ${card.title}`,
            color: user.color,
        });
        await board.save();

        return callback(false, { message: 'success' });
    } catch (error) {
        return callback({ errMessage: 'Something went wrong', details: error.message });
    }
};

const deleteMember = async (cardId, listId, boardId, user, memberId, callback) => {
    try {
        // Get models
        const card = await cardModel.findById(cardId);
        const list = await listModel.findById(listId);
        const board = await boardModel.findById(boardId);

        // Validate owner
        const validate = await helperMethods.validateCardOwners(card, list, board, user, false);
        if (!validate) {
            errMessage: 'You dont have permission to add member this card';
        }

        //delete member
        card.members = card.members.filter((a) => a.user.toString() !== memberId.toString());
        await card.save();

        //get member
        const tempMember = await userModel.findById(memberId);

        //Add to board activity
        board.activity.unshift({
            user: user._id,
            name: user.name,
            action:
                tempMember.name === user.name
                    ? `left ${card.title}`
                    : `removed '${tempMember.name}' from ${card.title}`,
            color: user.color,
        });
        board.save();

        return callback(false, { message: 'success' });
    } catch (error) {
        return callback({ errMessage: 'Something went wrong', details: error.message });
    }
};
module.exports = {
    create,
    getCard,
    update,
    updateLabel,
    updateLabelSelection,
    createLabel,
    addComment,
    deleteComment,
    updateComment,
    deleteLabel,
    uploadFile,
    addAttachmentToCard,
    deleteAttachmentCard,
    updateAttachmentCard,
    addMember,
    deleteMember,

}