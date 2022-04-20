
const {User,Thought} = require("../models");

 const userController = {
     //get all User
     getAllUser(req, res) {
         User.find({})
        .select("-__v")
        .sort({_id: -1})
        .then((dbUserdata) => res.json(dbUserdata))
        .catch((err) => {
             console.log(err);
             res.status(400).json(err);
         });
     },
        /* .populate({
             path: "thoughts",
             select: "-__v",
         })
         .populate({
             path: "friends",
             select: "-__v",
         })*/
      
         //get user by ID
     getUserById({params}, res) {
         User.findOne({_id: params.id})
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
                res.status(400).json(err);
            });
        },

        //create new user
createUser({body}, res) {
    User.create(body)
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => res.json(err));
},

//update user
updateUser({params, body}, res) {
    User.findOneAndUpdate({_id: params.id}, body, {
        new: true,
        runValidators:true,
    })
    .then(dbUserData => {
        if(!dbUserData) {
            res
            .status(404)
            .json({message: `No user found with ID ${params.id}`});
            return;
        }
        res.json(dbUserData);
    })
    .catch((err) => res.json(err));
},
deleteUser({ params }, res) {
   Thought.deleteMany({ userId: params.id })
      .then(() => {
        User.findOneAndDelete({ userId: params.id })
          .then(dbUserData => {
            if (!dbUserData) {
              res.status(404).json({ message: 'No User found with this id!' });
              return;
            }
            res.json(dbUserData);
          });
      })
      .catch(err => res.json(err));
  },

addFriend({params}, res) {
    console.log(params);
    User.findOneAndUpdate(
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
        User.findOneAndUpdate(
            {_id: params.id},
            {$pull:{friends:params.friendId}},
            {new:true,runValidators:true}
            )
            
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