const form = document.getElementById("compressForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const file =
        document.getElementById("pdfFile").files[0];

    if (!file) {
        alert("Please select a PDF.");
        return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login again.");
        window.location.href = "login.html";
        return;
    }

    const formData = new FormData();

    formData.append("pdf", file);

    try {

        const response = await fetch(
            "https://pdf-master-pro-xgql.onrender.com/api/pdf/compress",
            {
                method: "POST",

                headers: {
                    Authorization: `Bearer ${token}`
                },

                body: formData
            }
        );

        const data = await response.json();

        console.log("Compress:", data);

        if (!response.ok || !data.success) {

            alert(
                data.message ||
                "Compression failed."
            );

            return;
        }

        const downloadUrl =
            "https://pdf-master-pro-xgql.onrender.com" +
            data.download;

        const link =
            document.createElement("a");

        link.href = downloadUrl;
        link.download = "compressed.pdf";
        link.target = "_blank";

        document.body.appendChild(link);

        link.click();

        link.remove();

        alert(
            "PDF compressed successfully!"
        );

    } catch (error) {

        console.error(
            "Compress Error:",
            error
        );

        alert("Compression failed.");

    }

});