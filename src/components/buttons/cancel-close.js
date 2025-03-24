module.exports = {
    data: {
        name: 'cancel-close',
    },
    async execute(interaction) {
        try {
            await interaction.reply({
                content: 'Channel deletion has been canceled.',
                ephemeral: true,
            });
        } catch (error) {
            console.error('Error sending cancellation message:', error);
        }
    },
};
