const fetch = (await import('node-fetch')).default;
const secret = process.env.BOT_API_SECRET

const sendBotData = async (data) => {
    try {
        const response = await fetch('https://api.octaneinteractive.co.uk/api/bot-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${secret}`,
            },
            body: JSON.stringify({ data }),
        });

        if (!response.ok) {
            console.error(`Failed to send bot data: ${response.status} ${response.statusText}`);
            const errorDetails = await response.text();
            console.error('Server response:', errorDetails);
        } else {
            const responseBody = await response.json();
            console.log('Successfully sent bot data:', responseBody);
        }
    } catch (error) {
        console.error(`Error sending bot data: ${error.message}`);
    }
};

module.exports = { sendBotData };
