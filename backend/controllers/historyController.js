const History = require("../models/History");

const getHistory = async (req, res) => {

    try {

        const history = await History.find({
            user: req.user.id
        }).sort({
            createdAt: -1
        });

        return res.json({
            success: true,
            history
        });

    } catch (error) {

        console.error("GET HISTORY ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to load history."
        });

    }

};


// Delete user's own history
const deleteHistory = async (req, res) => {

    try {

        await History.deleteMany({
            user: req.user.id
        });

        console.log(
            "User History Deleted:",
            req.user.id
        );

        return res.json({

            success: true,

            message: "History deleted successfully."

        });

    } catch (error) {

        console.error(
            "DELETE HISTORY ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message: "Failed to delete history."

        });

    }

};


module.exports = {
    getHistory,
    deleteHistory
};