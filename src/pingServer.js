const fetch = require('node-fetch');

const SERVER_URL = 'https://api.octaneinteractive.co.uk/ping';

const pingServer = async () => {
    try {
        const response = await fetch(SERVER_URL, { method: 'GET' });
        console.log(`Web server pinged successfully. Response: ${await response.text()}`);
    } catch (err) {
        console.error('Error pinging web server:', err);
    }
};

setInterval(pingServer, 5 * 60 * 1000);

module.exports = pingServer;
