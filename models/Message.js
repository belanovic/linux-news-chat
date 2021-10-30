const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({

    room: {
        type: String
    },
    initialRooms: {
        type: Array
    },
    text: {
        type: String
    },
    messageToReply: {
        type: Number
    },
    username: {
        type: String
    },
    checked: {
        type: Array
    },
    milliseconds: {
        type: Number
    },
    profileImgURLLarge: {
        type: String
    }, 
    profileImgURLSmall: {
        type: String
    }
})

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;