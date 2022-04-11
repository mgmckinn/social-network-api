 const res = require("express/lib/response");
const {User} =require("../models");

 const userController = {
     getAllUsers(res) {
         user.find({})
         .populate({
             path: "thoughts",
             select: "-__v",
         })
         .populate({
             path: "friends",
             select: "-__v",
         })
         .select("-__v")
         .sort({_id: -1})
         .then((dbThoughtData) => res.json(dbThoughtData))
         .catch((err) => {
             console.log(err);
             res.status(500).json(err);
         });
     },
     getUserById({params}, res) {
         user.findOne({_id: params.id})
         .populate({
             path: "thoughts",
             select: "-__v"
            })
            .populate({
             path: "friends",
             select: "-__v"
            })
            select("-__v")
            .then((dbUserData) => {
                if (!dbUserData) {
                    res.status(404)
                    .json({message: `No user found with ID: ${params.id}`});
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
        },
createUser({body}, res) {
    user.create(body)
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
},
updateUser({params, body}, res) {
    user.findOneUpdate({_id: params.id}, body, {
        new: true,
        runValidators:true,
    })
    .then((dbUserData) => {
        if(!dbUserData) {
            res
            .status(404)
            .json({message: `No user found with ID ${params.id}`});
            return;
        }
        res.json(dbUserData);
    })
    .catch((err) => {
        console.log(err);
        res.status(400).json(err);
    });
},
deleteUser({params}, res) {
    user.findOneAndDelete({_id: params.id})
    .then((dbUserData) => {
        if(!dbUserData)  {
            res
            .status(404)
            .json({message: `No user found with ID ${params.id}`});
            return;
        }
        res.json(dbUserData);
    })
    .catch((err) => {
        console.log(err);
        res.status(400).json(err);
    });
},
addFriend({params}, res) {
    console.log(params);
    user.findOneAndUpdate(
        {_id: params.id},
        {$push: {friends: params.friendsId}},
        {new: true, runValidators:true}
    )
    .populate({
        path: "friends",
        select: "-__v",
      })
    .select("-__v")
    .then((dbUserData) => {
        if(!dbUserData) {
            res
            .status(404)
            .json({message: `No user found with ID: ${params.id}`});
            return;
        }
            res.json(dbUserData);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json(err); 
        });
    },
    deleteFriend({params}, res) {
        user.findOneAndUpdate(
            {_id: params.id},
            {$pull:{friends:params.friendId}},
            {new:true,runValidators:true}
            )
            .populate({
                path: "friends",
                select: "-__v"
            })
            .select("-__v")
            .then((dbUserData) => {
                if(!dbUserData) {
                    res
                    .status(404)
                    .json({message: `No user found with ID ${params.id}`});
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => {
                console.log(err);
                res.status(400).json(err);
            });
    },
};

module.exports = userController;