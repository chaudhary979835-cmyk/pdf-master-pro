const fs = require("fs");
const path = require("path");
const { PDFDocument } = require("pdf-lib");
const History = require("../models/History");

const splitPDF = async (req, res) => {

    try {

        const file = req.file;
        const splitPage = parseInt(req.body.splitPage);

        // Check PDF
        if (!file) {
            return res.status(400).json({
                success: false,
                message: "No PDF uploaded."
            });
        }

        // Read PDF
        const pdfBytes = fs.readFileSync(file.path);

        const pdfDoc = await PDFDocument.load(pdfBytes);

        const totalPages = pdfDoc.getPageCount();

        // Validate split page
        if (
            isNaN(splitPage) ||
            splitPage < 1 ||
            splitPage >= totalPages
        ) {
            return res.status(400).json({
                success: false,
                message: `Enter a page between 1 and ${totalPages - 1}`
            });
        }

        // =========================
        // First PDF
        // =========================

        const firstPDF = await PDFDocument.create();

        for (let i = 0; i < splitPage; i++) {

            const [page] =
                await firstPDF.copyPages(pdfDoc, [i]);

            firstPDF.addPage(page);
        }

        // =========================
        // Second PDF
        // =========================

        const secondPDF = await PDFDocument.create();

        for (let i = splitPage; i < totalPages; i++) {

            const [page] =
                await secondPDF.copyPages(pdfDoc, [i]);

            secondPDF.addPage(page);
        }

        // =========================
        // Output Folder
        // =========================

        const outputDir =
            path.join(__dirname, "../output");

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, {
                recursive: true
            });
        }

        // Output files
        const firstPath =
            path.join(outputDir, "split_part1.pdf");

        const secondPath =
            path.join(outputDir, "split_part2.pdf");

        // Save PDFs
        fs.writeFileSync(
            firstPath,
            await firstPDF.save()
        );

        fs.writeFileSync(
            secondPath,
            await secondPDF.save()
        );

        // =========================
        // Save History
        // =========================

        await History.create({

            user: req.user.id,

            operation: "Split PDF",

            fileName: file.originalname

        });

        

        // =========================
        // Response
        // =========================

        return res.json({

            success: true,

            message: "PDF Split Successfully!",

            files: [
                "/output/split_part1.pdf",
                "/output/split_part2.pdf"
            ]

        });

    } catch (error) {

        console.error(
            "SPLIT PDF ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};

module.exports = {
    splitPDF
};
