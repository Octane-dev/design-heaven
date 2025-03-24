const fetch = require("node-fetch");

const WEB_SERVER_URL = "https://api.octaneinteractive.co.uk/ping";

async function pingServer() {
    try {
        const response = await fetch(WEB_SERVER_URL, { method: "GET" });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        console.log("Successfully pinged the web server!");
    } catch (error) {
        console.error("Error pinging web server:", error.message);
    }
}

// Ping every 10 minutes
setInterval(pingServer, 10 * 60 * 1000);

pingServer();
