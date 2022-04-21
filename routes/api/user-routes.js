const router = require('express').Router();

const {
    getAllUser,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    deleteFriend
} = require('../../controllers/user-controller');

router
.route('/')
.get(getAllUser)
.post(createUser);

router
.route("/:id")
.get(getUserById)
.put(updateUser)
.delete(deleteUser);

router
.route("/:id/friend/:friendId")
.post(addFriend)
.delete(deleteFriend);

module.exports = router;