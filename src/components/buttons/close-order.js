const { ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: {
        name: 'close',
    },
    async execute(interaction) {
        if (!interaction.isButton()) return;

        const channel = interaction.channel;
        console.log('Channel retrieved from interaction:', channel);

        if (!channel || channel.type !== ChannelType.GuildText) {
            await interaction.reply({
                content: 'Channel not found or invalid type.',
                ephemeral: true,
            });
            return;
        }

        const confirmButton = new ButtonBuilder()
            .setCustomId(`confirm-close:${channel.id}`)
            .setLabel('Confirm')
            .setStyle(ButtonStyle.Danger);

        const cancelButton = new ButtonBuilder()
            .setCustomId(`cancel-close:${channel.id}`)
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder().addComponents(confirmButton, cancelButton);

        try {
            await interaction.reply({
                content: 'Are you sure you want to delete this channel? Click "Confirm" to proceed or "Cancel" to abort.',
                components: [row],
                ephemeral: true,
            });
        } catch (error) {
            console.error('Error sending confirmation message:', error);
        }
    },
};
