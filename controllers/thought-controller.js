const {Thought, User} = require("../../models");

const thoughtControllers = {
    //get all
    getAllThoughts(req, res) {
        Thought.find({})
       .populate({
           path: 'reactions',
           select: '-__v'
       })
       .select('-__v')
       .sort({_id: -1})
       .then(thoughtData => res.json(thoughtData))
       .catch(err => {
           console.log(err);
           res.status(500).json(err);
       });
    },
    getThoughtById({params}, res) {
        Thought.findOne({_id: params.id})
        .populate({
            path: "reactions",
            select: "-__v",
        })
        .then((thoughtData) => res.json(thoughtData))
        .catch((err) => {
            console.log(err);
            res.sendstatus(400);
        });
    },
    //create thought
    createThought({params, body}, res) {
        Thought.create(body)
        .then(({_id}) => {return User.findOneAndUpdate(
            {_id:params.userId},
            {$push: {thoughts:_id}},
            {new: true}
        );
    })
    .then((thoughtData) => {
        if(!thoughtData) {
            res.status(404)
            .json({message: `No thought found with ID: ${params}`});
            return;
        }
        res.json(thoughtData);
    })
    .catch((err) => res.json(err));
},

//update thought
updateThought({params,body},res) {
    Thought.findOneUpdate({_id: params.id},body, {
        new:true,
        runValidators: true,
    })

    .select("-__v")
    .then((thoughtData) => {
        if (!thoughtData) {
            res
            .status(404)
            .json({message: `No thought found for ID ${params.id}`});
            return;
        }
        res.json(thoughtData);
    })
    .catch ((err) => {
        console.log(err);
        res.status(505).json(err);
    });
},

//delete thought
deleteThought({params}, res)  {
    Thought.findOneAndDelete({_id: params.id})
    .then((thoughtData) => {
        if(!thoughtData) {
            res.status(404)
            .json({message: `No thought found for ID ${params.id}`});
        return;
        }
        res.json(thoughtData);
    })
    .catch((err) => {
        console.log(err);
        res.status(505).json(err);
    });
},

//add reaction
createReaction({params,body}, res) {
    Thought.findOneAndUpdate(
        {_id: params.thoughtId},
        {$push: {reactions: body}},
        {new: true, runValidators:true}
    )
    populate({
        path: "reactions",
        select: "-__v"
    })
    .select("-__v")
    .then((thoughtData) => {
        if(!thoughtData) {
            res.status(404)
            .json({
                message: `Cannot react. No reaction with ID: ${params.thoughtID}`,
            });
            return;
        }
        res.json(dbReactiontData);
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
},

//delete reaction
deleteReaction({params}, res) {
    Thought.findOneAndUpdate(
        {_id: params.thoughtId},
        {$pull: {reactions: {reactionId: params.reactionId}}},
        {new: true}
    )
    .then((thoughtData) => {
        if(!thoughtData) {
            res
            .status(404)
            .json({
                message: `No reaction found with ID:${params.reactionId}`,
            });
            return;
        }
        res.json(dbReactiontData);
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
},

};

module.exports = thoughtControllers;