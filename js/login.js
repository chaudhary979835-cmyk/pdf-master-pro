console.log("login.js loaded");

const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {

        const response = await fetch("https://pdf-master-pro-xgql.onrender.com/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        console.log("Status:", response.status);

        const data = await response.json();

        console.log(data);

        alert(data.message);

        if (data.success) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            window.location.href = "dashboard.html";
        }

    } catch (error) {

        console.error(error);
        alert("Server Error");

    }

});