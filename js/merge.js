const form = document.getElementById("mergeForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const files = document.getElementById("pdfFiles").files;

    if (files.length < 2) {
        alert("Select at least 2 PDF files.");
        return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login again.");
        window.location.href = "login.html";
        return;
    }

    const formData = new FormData();

    for (const file of files) {
        formData.append("pdfs", file);
    }

    try {

        const response = await fetch(
            "https://pdf-master-pro-xgql.onrender.com/api/pdf/merge",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            }
        );

        const data = await response.json();

        console.log("Merge:", data);

        if (!response.ok || !data.success) {
            alert(data.message || "Merge failed.");
            return;
        }

        const downloadUrl =
            "https://pdf-master-pro-xgql.onrender.com" + data.download;

        const link = document.createElement("a");

        link.href = downloadUrl;
        link.download = "merged.pdf";
        link.target = "_blank";

        document.body.appendChild(link);
        link.click();
        link.remove();

        alert("Merge completed successfully!");

    } catch (error) {

        console.error("Merge Error:", error);
        alert("Merge failed.");

    }

});