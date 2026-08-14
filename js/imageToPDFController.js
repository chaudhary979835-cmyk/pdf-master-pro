const form =
    document.getElementById("imageToPDFForm");

const token =
    localStorage.getItem("token");

console.log("imageToPDF.js loaded");


if (!form) {

    console.error(
        "imageToPDFForm not found!"
    );

} else {

    form.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();

            console.log(
                "Convert button clicked"
            );


            const input =
                document.getElementById(
                    "imageFiles"
                );


            const files =
                input.files;


            console.log(
                "Selected files:",
                files.length
            );


            if (!files || files.length === 0) {

                alert(
                    "Please select an image."
                );

                return;

            }


            if (!token) {

                alert(
                    "Please login first."
                );

                window.location.href =
                    "login.html";

                return;

            }


            const formData =
                new FormData();


            for (
                let i = 0;
                i < files.length;
                i++
            ) {

                console.log(
                    "Adding:",
                    files[i].name
                );

                formData.append(
                    "images",
                    files[i]
                );

            }


            try {

                console.log(
                    "Sending Image to PDF request..."
                );


                const response =
                    await fetch(
                        "https://pdf-master-pro-xgql.onrender.com/api/pdf/image-to-pdf",
                        {

                            method: "POST",

                            headers: {

                                Authorization:
                                    `Bearer ${token}`

                            },

                            body: formData

                        }
                    );


                console.log(
                    "Server response:",
                    response.status
                );


                const data =
                    await response.json();


                console.log(
                    "Server data:",
                    data
                );


                if (
                    !response.ok ||
                    !data.success
                ) {

                    alert(
                        data.message ||
                        "Image to PDF failed."
                    );

                    return;

                }


                alert(
                    data.message
                );


                // Download
                const downloadUrl =
                    "https://pdf-master-pro-xgql.onrender.com" +
                    data.download;


                console.log(
                    "Download URL:",
                    downloadUrl
                );


                const link =
                    document.createElement(
                        "a"
                    );


                link.href =
                    downloadUrl;


                link.download =
                    "images-to-pdf.pdf";


                document.body.appendChild(
                    link
                );


                link.click();


                link.remove();


                console.log(
                    "Download started."
                );


            } catch (error) {

                console.error(
                    "IMAGE TO PDF FRONTEND ERROR:",
                    error
                );


                alert(
                    "Image to PDF failed. Check Console."
                );

            }

        }
    );

}