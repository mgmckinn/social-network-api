const {schema, model, types} = require('mongoose');
const moment = require('moment');

const reactionSchema = new schema(
    {
        reactionId: {
            type:schema.types.objectId,
            default: () => types.objectId(),
        },
        reactionBody: {
            type: String,
            required: true,
            maxlength: 280,
        },
        username: {
            type: String,
            required: true,
            trim: true,
        },
        createdAt: {
            type: String,
            default: Date.now,
            get: (createdAtVal) => moment(createdAtVal).format("MMM,DD,YYYY [at] hh:mm a"),
        },
    },
    {
        toJSON: {
            getters: true,
        },
    }
);
const thoughtSchema = new schema(
    {
    thoughtText: {
        type: String,
        required: true,
        maxlength: 280,
        minlength: 1,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (createdAtVal).format("MMM,DD,YYYY [at] hh:mm a"),
    },
    username: {
        type: String,
        required: true,
    },
    reactions: [reactionSchema],
},
{
    toJSON: {
        getters: true,
        virtual: true,
    },
    id:false,
}
);
thoughtSchema.virtual("reactionCount").get(function () {
    return this.reaction.length;
});
const thought =model("thought, thoughtSchema");

module.exports = thought;
        
    
