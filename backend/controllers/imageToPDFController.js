const fs = require("fs");
const path = require("path");
const { PDFDocument } = require("pdf-lib");
const History = require("../models/History");

const imageToPDF = async (req, res) => {

    try {

        console.log("===== IMAGE TO PDF START =====");

        const files = req.files;

        console.log(
            "Received files:",
            files ? files.map(file => file.originalname) : []
        );

        // Check files
        if (!files || files.length === 0) {

            return res.status(400).json({
                success: false,
                message: "Please select at least one JPG or PNG image."
            });

        }

        // Create PDF
        const pdfDoc = await PDFDocument.create();

        for (const file of files) {

            console.log(
                "Processing:",
                file.originalname
            );

            const imageBytes =
                fs.readFileSync(file.path);

            const extension =
                path.extname(
                    file.originalname
                ).toLowerCase();

            let image;

            if (
                extension === ".jpg" ||
                extension === ".jpeg"
            ) {

                image =
                    await pdfDoc.embedJpg(
                        imageBytes
                    );

            } else if (
                extension === ".png"
            ) {

                image =
                    await pdfDoc.embedPng(
                        imageBytes
                    );

            } else {

                console.log(
                    "Unsupported file:",
                    file.originalname
                );

                continue;
            }

            // Image size
            const width = image.width;
            const height = image.height;

            // Create page
            const page =
                pdfDoc.addPage([
                    width,
                    height
                ]);

            // Draw image
            page.drawImage(image, {

                x: 0,

                y: 0,

                width: width,

                height: height

            });

        }

        // Check PDF
        if (pdfDoc.getPageCount() === 0) {

            return res.status(400).json({
                success: false,
                message: "No valid JPG, JPEG or PNG image found."
            });

        }

        // Save PDF
        const pdfBytes =
            await pdfDoc.save();

        // Output directory
        const outputDir =
            path.join(
                __dirname,
                "../output"
            );

        if (!fs.existsSync(outputDir)) {

            fs.mkdirSync(
                outputDir,
                {
                    recursive: true
                }
            );

        }

        // Unique filename
        const outputFileName =
            "images-to-pdf-" +
            Date.now() +
            ".pdf";

        const outputPath =
            path.join(
                outputDir,
                outputFileName
            );

        // Write PDF
        fs.writeFileSync(
            outputPath,
            pdfBytes
        );

        console.log(
            "PDF CREATED:",
            outputPath
        );

        // Save History
        await History.create({

            user: req.user.id,

            operation: "Image to PDF",

            fileName:
                files
                    .map(
                        file =>
                            file.originalname
                    )
                    .join(", ")

        });

        console.log(
            "Image to PDF History Saved Successfully"
        );

        console.log(
            "===== IMAGE TO PDF SUCCESS ====="
        );

        return res.json({

            success: true,

            message:
                "Images converted to PDF successfully!",

            download:
                `/output/${encodeURIComponent(
                    outputFileName
                )}`

        });

    } catch (error) {

        console.error(
            "IMAGE TO PDF ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Image to PDF conversion failed."

        });

    }

};

module.exports = {
    imageToPDF
};
