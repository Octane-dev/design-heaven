module.exports = {
    data: {
        name: 'confirm-close',
    },
    async execute(interaction) {
        const channel = interaction.channel;

        try {
            await interaction.reply({
                content: 'Channel will now be deleted.',
                ephemeral: true,
            });

            setTimeout(async () => {
                await channel.delete();
                console.log(`Channel ${channel.name} deleted successfully.`);
            }, 2000);
        } catch (error) {
            console.error('Error deleting channel:', error);

            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: 'There was an error closing the channel. Please try again later.',
                    ephemeral: true,
                });
            }
        }
    },
};
