const { ChannelType } = require('discord.js');

module.exports = {
    data: {
        name: 'close'
    },
    async execute(interaction, client) {
        if (!interaction.isButton()) return;

        // Extract channel ID from customId
        const [action, channelId] = interaction.customId.split(':');
        if (action !== 'close') return;

        // Access the channel using client
        const channel = client.channels.cache.get(channelId);

        if (!channel || channel.type !== ChannelType.GuildText) {
            await interaction.reply({ content: 'Channel not found or invalid type.', ephemeral: true });
            return;
        }

        try {
            // Inform user and delete the channel
            await interaction.reply({ content: 'Channel will be closed and deleted.', ephemeral: true });
            await channel.delete();
        } catch (error) {
            console.error('Error deleting channel:', error);
            await interaction.reply({ content: 'There was an error closing the channel. Please try again later.', ephemeral: true });
        }
    }
};
