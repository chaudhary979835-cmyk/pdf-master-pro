const express = require("express");

const router = express.Router();

const {
    getHistory,
    deleteHistory
} = require("../controllers/historyController");

const authMiddleware =
    require("../middleware/authMiddleware");


// Get History
router.get(
    "/",
    authMiddleware,
    getHistory
);


// Delete History
router.delete(
    "/",
    authMiddleware,
    deleteHistory
);


module.exports = router;