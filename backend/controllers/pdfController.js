const fs = require("fs");
const path = require("path");
const { PDFDocument } = require("pdf-lib");
const History = require("../models/History");

const mergePDF = async (req, res) => {

    try {

        const files = req.files;

        if (!files || files.length < 2) {
            return res.status(400).json({
                success: false,
                message: "Select at least 2 PDF files."
            });
        }

        const mergedPdf = await PDFDocument.create();

        for (const file of files) {

            const bytes = fs.readFileSync(file.path);

            const pdf = await PDFDocument.load(bytes);

            const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());

            pages.forEach((page) => mergedPdf.addPage(page));

        }

        const mergedBytes = await mergedPdf.save();

        const outputPath = path.join(
            __dirname,
            "../output/merged.pdf"
        );

        fs.writeFileSync(outputPath, mergedBytes);
        
        

        await History.create({

    user: req.user.id,

    operation: "Merge PDF",

    fileName: files.map(file => file.originalname).join(", ")

});


        return res.json({
    success: true,
    message: "PDF merged successfully!",
    download: "/output/merged.pdf"
    });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Merge Failed"
        });

    }

};

module.exports = {
    mergePDF
};



