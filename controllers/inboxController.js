var mongoose = require("mongoose");

//===================== last received messages =====================//
module.exports.getAllInbox = async (userId) => {
  try {
    AllInbox = await Inbox.aggregate([
      
      {
        $match: {
          $or: [
            {
              receiverId: new mongoose.Types.ObjectId(userId)
            }
          ]
        }
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: { senderId: "$senderId" },
          lastReceivedMessage: { $first: "$message" },
          Datewrote: { $first: "$createdAt" }
        }
      },

      {
        $lookup: {
          from: "users",
          localField: "_id.senderId",
          foreignField: "_id",
          as: "senderName"
        }
      },
      {
        $project: { "senderName.name": 1, lastReceivedMessage: 1, Datewrote: 1 }
      },
      { $sort: { Datewrote: -1 } }
    ]);

    return AllInbox;
  } catch (err) {
    console.log(err);
    return err;
  }
};


module.exports.getSpecificInbox = async (userId, user2Id) => {
  try {
    console.log(user2Id)
    AllInbox = await Inbox.aggregate([
      {
        $match: {
          $or: [
            {
              $and: [
                { senderId: mongoose.Types.ObjectId(userId) },
                { receiverId: mongoose.Types.ObjectId(user2Id) }
              ]
            },

            {
              $and: [
                { receiverId: mongoose.Types.ObjectId(userId) },
                { senderId: mongoose.Types.ObjectId(user2Id) }
              ]
            }
          ]
        }
      },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "senderId",
          foreignField: "_id",
          as: "senderName"
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "receiverId",
          foreignField: "_id",
          as: "receiverId"
        },
      },
      {
        $project: { "senderName.name": 1,"receiverId.name": 1 ,message: 1, updatedAt: 1,createdAt:1 }
      },
      {$limit:20},
      { $sort: { createdAt: 1 } },
    ]);
    return AllInbox;
  } catch (err) {
    console.log(err);
    return err;
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    newMessage = new Inbox(req.body);
    newMessage.senderId = req.user._id;
    await newMessage.save();
    res.status(201).send({mess:'message sent'});
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};
