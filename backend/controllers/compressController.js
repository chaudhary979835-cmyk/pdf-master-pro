const fs = require("fs");
const path = require("path");
const { PDFDocument } = require("pdf-lib");
const History = require("../models/History");

const compressPDF = async (req, res) => {

    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No PDF uploaded."
            });
        }

        const pdfBytes = fs.readFileSync(req.file.path);

        const pdfDoc = await PDFDocument.load(pdfBytes);

        const compressedBytes = await pdfDoc.save({
            useObjectStreams: true
        });

        const outputDir =
            path.join(__dirname, "../output");

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, {
                recursive: true
            });
        }

        const outputPath =
            path.join(outputDir, "compressed.pdf");

        fs.writeFileSync(
            outputPath,
            compressedBytes
        );

        await History.create({
            user: req.user.id,
            operation: "Compress PDF",
            fileName: req.file.originalname
        });

        return res.json({
            success: true,
            message: "PDF Compressed Successfully!",
            download: "/output/compressed.pdf"
        });

    } catch (err) {

        console.error("Compress PDF Error:", err);

        return res.status(500).json({
            success: false,
            message: "Compression Failed"
        });
    }
};

module.exports = {
    compressPDF
};