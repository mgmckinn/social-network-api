const res = require("express/lib/response");
const {thought, user} = require("../../models");

const thoughtController = {
    getAllThoughts(req, res) {
        thought.find({})
        ,sort({_id:-1})
        .then((dbThoughtData) => res.json(dbThoughtData))
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },
    getThoughById({params}, res) {
        thought.findOne({_id: params.id})
        .populate({
            path: "reactions",
            select: "-__v",
        })
        .select("-__v")
        .then((dbThoughtData) => {
            if (!dbThoughtData) {
                res
                .status(404)
                .json({message: `No thought found with ID: ${params.id}`});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },
    createThought({params, body}, res) {
        thought.create(body)
        .then(({_id}) => {return user.findOneAndUpdate(
            {_id:params.userId},
            {$push: {thoughts:_id}},
            {new: true, runValidators:true}
        );
    })
    .then((dbThoughtData) => {
        if(!dbThoughtData) {
            res.status(404)
            .json({message: `No thought found with ID: ${params}`});
            return;
        }
        res.json(dbThoughtData);
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
},
updateThought({params,body},res) {
    thought.findOneUpdate({_id: params.id},body, {
        new:true,
        runValidators: true,
    })
    .populate({
        path: "reactions",
        select: "-__v",
    })
    .select("-__v")
    .then((dbThoughtData) => {
        if (!dbThoughtData) {
            res
            .status(404)
            .json({message: `No thought found for ID ${params.id}`});
            return;
        }
        res.json(dbThoughtData);
    })
    .catch ((err) => {
        console.log(err);
        res.status(505).json(err);
    });
},
deleteThought({params}, res)  {
    thought.findOneAndDelete({_id: params.id})
    .then((dbThoughtData) => {
        if(!dbThoughtData) {
            res.status(404)
            .json({message: `No thought found for ID ${params.id}`});
        return;
        }
        res.json(dbThoughtData);
    })
    .catch((err) => {
        console.log(err);
        res.status(505).json(err);
    });
},
addReation({params,body}, res) {
    thought.findOneAndUpdate(
        {_id: params.thoughtId},
        {$push: {reactions: body}},
        {new: true, runValidators:true}
    )
    populate({
        path: "reactions",
        select: "-__v"
    })
    .select("-__v")
    .then((dbThoughtData) => {
        if(!dbThoughtData) {
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
deleteReaction({params}, res) {
    thought.findOneAndUpdate(
        {_id: params.thoughtId},
        {$pull: {reactions: {reactionId: params.reactionId}}},
        {new: true}
    )
    .then((dbThoughtData) => {
        if(!dbThoughtData) {
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

module.exports = thoughtController;