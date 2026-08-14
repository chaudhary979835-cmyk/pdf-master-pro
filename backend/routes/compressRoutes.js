const express = require("express");
const router = express.Router();
const multer = require("multer");

const { compressPDF } = require("../controllers/compressController");
const authMiddleware = require("../middleware/authMiddleware");


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
// PDF FILE FILTER
// ===============================

const fileFilter = (req, file, cb) => {

    const extension =
        file.originalname
            .toLowerCase()
            .endsWith(".pdf");

    const mimeType =
        file.mimetype === "application/pdf";


    if (extension && mimeType) {

        cb(null, true);

    } else {

        cb(
            new Error(
                "Only PDF files are allowed."
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
        fileSize: 20 * 1024 * 1024
    }

});


// ===============================
// COMPRESS PDF
// ===============================

router.post(

    "/compress",

    authMiddleware,

    (req, res, next) => {

        upload.single("pdf")(
            req,
            res,
            (error) => {

                if (error instanceof multer.MulterError) {

                    if (
                        error.code ===
                        "LIMIT_FILE_SIZE"
                    ) {

                        return res.status(400).json({

                            success: false,

                            message:
                                "PDF must be smaller than 20 MB."

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

    compressPDF

);


module.exports = router;