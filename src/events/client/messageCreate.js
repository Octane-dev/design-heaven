module.exports = {
    name: 'messageCreate',
    execute(message, client) {
        client.messageCount = (client.messageCount || 0) + 1;
    },
};
