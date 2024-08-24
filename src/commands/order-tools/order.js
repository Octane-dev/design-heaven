const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('order')
        .setDescription('Place a motion design order for a creator')
        .addUserOption(option =>
            option
                .setName('creator')
                .setDescription('The creator that you are ordering from.')
                .setRequired(true)),
    async execute(interaction, client) {
        const creator = interaction.options.getUser('creator');
        // const confirmButtonId = `order-confirm_${creator.id}_${interaction.user.id}`;

        const confirmButton = new ButtonBuilder()
            .setCustomId(`order-confirm:${creator.id}_${interaction.user.id}`)
            .setLabel('Confirm')
            .setStyle(ButtonStyle.Success);

        const cancelButton = new ButtonBuilder()
            .setCustomId('order-cancel')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Danger);

        // const moreInfoButton = new ButtonBuilder()
        //     .setCustomId('order-more-info')
        //     .setLabel('More Info')
        //     .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder()
            .addComponents(confirmButton, cancelButton);
            // .addComponents(confirmButton, cancelButton, moreInfoButton);

        await interaction.reply({
            content: `You are submitting an order request for ${creator}. Confirm?`,
            components: [row],
            ephemeral:true,
        });
    }
};
