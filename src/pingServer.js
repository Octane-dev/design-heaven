const pingServer = () => {
    setInterval(async () => {
        try {
            const fetch = (await import('node-fetch')).default;
            const response = await fetch('https://api.octaneinteractive.co.uk/ping');
            if (!response.ok) {
                console.error(`Server responded with status: ${response.status}`);
            } else {
                console.log('Successfully pinged web server!');
            }
        } catch (error) {
            console.error(`Error pinging web server: ${error.message}`);
        }
    }, 5 * 60 * 1000); // Ping every 5 minutes
};

module.exports = { pingServer };
