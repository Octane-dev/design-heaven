const { PermissionsBitField, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: {
        name: 'order-confirm'
    },
    async execute(interaction, client) {
        // Log interaction details
        console.log('Button interaction received:', interaction.customId);

        // Extract IDs from customId
        const action = interaction.customId.split(':')[0];
        const ids = interaction.customId.split(':')[1];
        const creatorUserId = ids.split('_')[0];
        const interactionUserId = ids.split('_')[1];
        console.log(action, creatorUserId, interactionUserId);

        if (action !== 'order-confirm') {
            console.warn('Unexpected action:', action);
            return;
        }

        const guild = interaction.guild;
        const categoryId = '1274783328649613313'; // Replace with the actual category ID

        const category = guild.channels.cache.get(categoryId);
        if (!category) {
            console.error('Category not found:', categoryId);
            await interaction.update({
                content: 'Error: Category not found.',
                components: [],
            });
            return;
        }

        const creatorUser = await guild.members.fetch(creatorUserId);
        const interactionUser = await guild.members.fetch(interactionUserId);

        if (!creatorUser || !interactionUser) {
            console.error('One or both users not found:', creatorUserId, interactionUserId);
            await interaction.update({
                content: 'Error: Users not found.',
                components: [],
            });
            return;
        }

        const creatorUsername = creatorUser.user.username;
        const interactionUsername = interactionUser.user.username;

        const channelName = `order-${interactionUsername}-${creatorUsername}`;
        // Validate channel name
        if (!channelName || channelName.length < 2 || channelName.length > 100) {
            console.error('Invalid channel name:', channelName);
            await interaction.update({
                content: 'Error: Invalid channel name.',
                components: [],
            });
            return;
        }

        try {
            const newChannel = await guild.channels.create({
                name: channelName,
                type: ChannelType.GuildText,
                parent: category.id,
                permissionOverwrites: [
                    {
                        id: guild.roles.everyone,
                        deny: [PermissionsBitField.Flags.ViewChannel],
                    },
                    {
                        id: interactionUserId,
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                    },
                    {
                        id: creatorUserId,
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                    },
                ],
            });

            console.log('Channel created:', newChannel.id);

            const closeButton = new ButtonBuilder()
                .setCustomId(`close:${newChannel.id}`)
                .setLabel('Close')
                .setStyle(ButtonStyle.Danger);

            // Send a message with the close button
            const row = new ActionRowBuilder().addComponents(closeButton);

            // await newChannel.send({
            //     content: 'This is your order channel. Click the button below to close the channel.',
            //     components: [row],
            // });

            await interaction.update({
                content: `Order confirmed. A new channel has been created: <#${newChannel.id}>.`,
                components: [],
            });
        } catch (error) {
            console.error('Error creating channel:', error);
            await interaction.update({
                content: 'There was an error creating the channel. Please try again later.',
                components: [],
            });
        }
    }
};
