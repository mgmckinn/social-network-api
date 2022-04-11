const router =require('express').Router();
const{
    getAllThoughts,
    getThoughtsById,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    deleteReaction,
} = require('../../controllers/thought-controller');

router.route("/").get(getAllThoughts);

router
.route("/id")
.get(getThoughtsById)
.put(updateThought)
.delete(deleteThought);

router.route("/:userId").post(createThought);

router.route("/:thoughtId.reactions").post(addReaction);

router.route("/:thoughtId/:reactionId").delete(deleteReaction);

module.exports = router;