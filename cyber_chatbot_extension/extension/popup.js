document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");
    const verifyBtn = document.getElementById("verify-link-btn");
    const reportBtn = document.getElementById("report-link-btn");

    function appendMessage(sender, message) {
        const msg = document.createElement("div");
        msg.textContent = sender + ": " + message;
        msg.style.padding = "8px";
        msg.style.margin = "5px 0";
        msg.style.borderRadius = "5px";
        msg.style.background = sender === "Bot" ? "#e1f5fe" : "#c8e6c9";
        chatBox.appendChild(msg);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    appendMessage("Bot", "Hi, I am your Cyber Buddy. How can I help you?");

    sendBtn.addEventListener("click", function () {
        const message = userInput.value.trim();
        if (message) {
            appendMessage("You", message);
            fetch("http://127.0.0.1:5000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message })
            })
            .then(response => response.json())
            .then(data => appendMessage("Bot", data.response))
            .catch(() => appendMessage("Bot", "Error connecting to server."));
        }
        userInput.value = "";
    });

    verifyBtn.addEventListener("click", function () {
        const link = prompt("Enter the link to verify:");
        if (link) {
            fetch("http://127.0.0.1:5000/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ link })
            })
            .then(response => response.json())
            .then(data => appendMessage("Bot", data.message))
            .catch(() => appendMessage("Bot", "Verification failed."));
        }
    });

    reportBtn.addEventListener("click", function () {
        const link = prompt("Enter the suspicious link:");
        if (link) {
            const username = prompt("Enter your username:");  // 🔹 Ask for username every time
            if (username) {
                fetch("http://127.0.0.1:5000/report", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ link, username })  // 🔹 Send username along with the link
                })
                .then(response => response.json())
                .then(data => appendMessage("Bot", data.message))
                .catch(() => appendMessage("Bot", "Reporting failed."));
            } else {
                appendMessage("Bot", "❌ Reporting cancelled: Username is required.");
            }
        }
    });
    
});
