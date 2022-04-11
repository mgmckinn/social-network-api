const {schema, model} = require('mongoose');

const emailValidation =function (email) {
    let regex = /^[a-z0-9_\-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
    return regex.test(String(email).toLowerCase());
};

const userSchema = new schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: emailValidation,
            message: (email) => `${email.vaule} please enter a valid email address`,
        },
        },
        thoughts: [
            {
                type: schema.types.objectId,
                ref: "thought",
            },
        ],
        friends: [
            {type: schema.types.objectId,
            ref: "user",
        },
        ],
    },
    {
        toJSON: {
            virtual: true,
        },
        id:false,
    }
);
userSchema.virtual("friendCount").get(function () {
    return this.friends.length;
});
const user = model("user", userSchema);
module.exports = user;
