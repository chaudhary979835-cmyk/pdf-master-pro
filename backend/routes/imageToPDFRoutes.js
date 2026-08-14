const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
    imageToPDF
} = require("../controllers/imageToPDFController");

const authMiddleware =
    require("../middleware/authMiddleware");


// ===============================
// STORAGE
// ===============================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, "uploads/");

    },

    filename: (req, file, cb) => {

        cb(
            null,
            Date.now() + "-" + file.originalname
        );

    }

});


// ===============================
// IMAGE FILE FILTER
// ===============================

const fileFilter = (req, file, cb) => {

    const allowedTypes = [
        "image/jpeg",
        "image/png"
    ];

    const extension =
        file.originalname
            .toLowerCase()
            .match(/\.(jpg|jpeg|png)$/);


    if (
        allowedTypes.includes(file.mimetype) &&
        extension
    ) {

        cb(null, true);

    } else {

        cb(
            new Error(
                "Only JPG, JPEG and PNG images are allowed."
            ),
            false
        );

    }

};


// ===============================
// MULTER
// ===============================

const upload = multer({

    storage: storage,

    fileFilter: fileFilter,

    limits: {

        fileSize: 20 * 1024 * 1024,

        files: 10

    }

});


// ===============================
// IMAGE TO PDF
// ===============================

router.post(

    "/image-to-pdf",

    authMiddleware,

    (req, res, next) => {

        upload.array("images", 10)(
            req,
            res,
            (error) => {

                if (
                    error instanceof
                    multer.MulterError
                ) {

                    if (
                        error.code ===
                        "LIMIT_FILE_SIZE"
                    ) {

                        return res.status(400).json({

                            success: false,

                            message:
                                "Each image must be smaller than 20 MB."

                        });

                    }


                    if (
                        error.code ===
                        "LIMIT_FILE_COUNT"
                    ) {

                        return res.status(400).json({

                            success: false,

                            message:
                                "You can upload maximum 10 images."

                        });

                    }


                    return res.status(400).json({

                        success: false,

                        message: error.message

                    });

                }


                if (error) {

                    return res.status(400).json({

                        success: false,

                        message: error.message

                    });

                }


                next();

            }
        );

    },

    imageToPDF

);


module.exports = router;