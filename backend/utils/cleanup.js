const fs = require("fs");

const deleteFile = (filePath) => {

    try {

        if (filePath && fs.existsSync(filePath)) {

            fs.unlinkSync(filePath);

            console.log(
                "Deleted:",
                filePath
            );

        }

    } catch (error) {

        console.error(
            "File delete error:",
            error.message
        );

    }

};


const deleteUploadedFiles = (files) => {

    if (!files) {
        return;
    }


    // Single file
    if (!Array.isArray(files)) {

        deleteFile(files.path);

        return;

    }


    // Multiple files
    files.forEach(file => {

        deleteFile(file.path);

    });

};


module.exports = {
    deleteFile,
    deleteUploadedFiles
};