const form = document.getElementById("splitForm");
const token = localStorage.getItem("token");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const file = document.getElementById("pdfFile").files[0];
    const splitPage = document.getElementById("splitPage").value;

    if (!file) {
        alert("Please select a PDF file.");
        return;
    }

    if (!splitPage) {
        alert("Please enter a split page.");
        return;
    }

    if (!token) {
        alert("Please login again.");
        window.location.href = "login.html";
        return;
    }

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("splitPage", splitPage);

    try {
        const response = await fetch(
            "http://localhost:5000/api/pdf/split",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
            alert(data.message || "Split failed.");
            return;
        }

        for (let i = 0; i < data.files.length; i++) {

            const fileUrl =
                "http://localhost:5000" + data.files[i];

            const fileResponse = await fetch(fileUrl);

            if (!fileResponse.ok) {
                throw new Error("Could not download split file.");
            }

            const blob = await fileResponse.blob();

            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = blobUrl;
            link.download =
                i === 0
                    ? "split_part1.pdf"
                    : "split_part2.pdf";

            document.body.appendChild(link);
            link.click();
            link.remove();

            URL.revokeObjectURL(blobUrl);

            // Give browser a moment between downloads
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        alert("Split PDF files downloaded successfully!");

    } catch (error) {
        console.error("Split Download Error:", error);
        alert("Split/download failed.");
    }
});