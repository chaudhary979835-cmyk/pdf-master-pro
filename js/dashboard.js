console.log("dashboard.js loaded");

// ===============================
// CHECK LOGIN
// ===============================

const token = localStorage.getItem("token");

if (!token) {

    alert("Please login first.");

    window.location.href = "login.html";

}


// ===============================
// SHOW USER NAME
// ===============================

const user =
    JSON.parse(localStorage.getItem("user"));

if (user) {

    const welcomeUser =
        document.getElementById("welcomeUser");

    if (welcomeUser) {

        welcomeUser.innerText =
            `Welcome 👋 ${user.name}`;

    }

}


// ===============================
// LOGOUT
// ===============================

const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        () => {

            localStorage.removeItem("token");

            localStorage.removeItem("user");

            window.location.href =
                "login.html";

        }
    );

}


// ===============================
// LOAD HISTORY
// ===============================

async function loadHistory() {

    try {

        const response =
            await fetch(
                "https://pdf-master-pro-xgql.onrender.com/api/history",
                {
                    method: "GET",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        console.log(
            "History response:",
            data
        );


        if (
            !response.ok ||
            !data.success
        ) {

            console.error(
                "History loading failed:",
                data.message
            );

            return;

        }


        const history =
            data.history || [];


        const tbody =
            document.querySelector(
                "#historyTable tbody"
            );


        if (!tbody) {
            return;
        }


        // Clear old rows

        tbody.innerHTML = "";


        // ===============================
        // NO HISTORY
        // ===============================

        if (history.length === 0) {

            tbody.innerHTML = `

                <tr>

                    <td
                        colspan="3"
                        style="text-align:center;"
                    >

                        No History Found

                    </td>

                </tr>

            `;

        }


        // ===============================
        // SHOW HISTORY
        // ===============================

        else {

            history.forEach(item => {

                const row =
                    document.createElement("tr");


                const operation =
                    document.createElement("td");

                operation.innerText =
                    item.operation;


                const fileName =
                    document.createElement("td");

                fileName.innerText =
                    item.fileName;


                const date =
                    document.createElement("td");

                date.innerText =
                    new Date(
                        item.createdAt
                    ).toLocaleString();


                row.appendChild(operation);

                row.appendChild(fileName);

                row.appendChild(date);


                tbody.appendChild(row);

            });

        }


        // ===============================
        // DASHBOARD STATISTICS
        // ===============================

        const filesProcessed =
            document.getElementById(
                "filesProcessed"
            );


        const recentJobs =
            document.getElementById(
                "recentJobs"
            );


        if (filesProcessed) {

            filesProcessed.innerText =
                history.length;

        }


        if (recentJobs) {

            recentJobs.innerText =
                Math.min(
                    history.length,
                    15
                );

        }


    } catch (error) {

        console.error(
            "History Error:",
            error
        );

    }

}


// ===============================
// DELETE HISTORY
// ===============================

const deleteHistoryBtn =
    document.getElementById(
        "deleteHistoryBtn"
    );


if (deleteHistoryBtn) {

    deleteHistoryBtn.addEventListener(
        "click",
        async () => {

            const confirmDelete =
                confirm(
                    "Are you sure you want to delete all your history?"
                );


            if (!confirmDelete) {
                return;
            }


            try {

                const response =
                    await fetch(
                        "https://pdf-master-pro-xgql.onrender.com/api/history",
                        {
                            method: "DELETE",

                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );


                const data =
                    await response.json();


                if (
                    !response.ok ||
                    !data.success
                ) {

                    alert(
                        data.message ||
                        "Failed to delete history."
                    );

                    return;

                }


                alert(
                    "History deleted successfully!"
                );


                // Reload history

                await loadHistory();


            } catch (error) {

                console.error(
                    "Delete History Error:",
                    error
                );


                alert(
                    "Failed to delete history."
                );

            }

        }
    );

}


// ===============================
// LOAD DASHBOARD
// ===============================

loadHistory();