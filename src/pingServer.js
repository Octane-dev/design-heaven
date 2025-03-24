const pingServer = () => {
    const secret = process.env.PING_SECRET;

    setInterval(async () => {
        try {
            const fetch = (await import('node-fetch')).default;
            const response = await fetch('https://api.octaneinteractive.co.uk/ping', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${secret}`
                }
            });
            if (!response.ok) {
                console.error(`Server responded with status: ${response.status}`);
            } else {
                console.log('Successfully pinged web server!');
            }
        } catch (error) {
            console.error(`Error pinging web server: ${error.message}`);
        }
    }, 5 * 60 * 1000);
};

module.exports = { pingServer };
