const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('post')
        .setDescription('Post a resource in a resource channel.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addSubcommandGroup(group =>
            group
                .setName('after-effects')
                .setDescription('Post After Effects resources.')
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('presets')
                        .setDescription('Post an After Effects Preset resource.')
                        .addUserOption(option =>
                            option
                                .setName('created-by')
                                .setDescription('The user who created this resource.')
                                .setRequired(true))
                        .addAttachmentOption(option =>
                            option
                                .setName('file')
                                .setDescription('The file to upload.')
                                .setRequired(true))
                        .addStringOption(option =>
                            option
                                .setName('name')
                                .setDescription('The name of the resource.')
                                .setRequired(true))
                        .addStringOption(option =>
                            option
                                .setName('instructions')
                                .setDescription('Any instructions or notes for the resource (optional).'))
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('plugins')
                        .setDescription('Post an After Effects Plugin resource.')
                        .addUserOption(option =>
                            option
                                .setName('created-by')
                                .setDescription('The user who created this resource.')
                                .setRequired(true))
                        .addAttachmentOption(option =>
                            option
                                .setName('file')
                                .setDescription('The file to upload.')
                                .setRequired(true))
                        .addStringOption(option =>
                            option
                                .setName('name')
                                .setDescription('The name of the resource.')
                                .setRequired(true))
                        .addStringOption(option =>
                            option
                                .setName('instructions')
                                .setDescription('Any instructions or notes for the resource (optional).'))
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('panzoid')
                .setDescription('Post a Panzoid resource.')
                .addUserOption(option =>
                    option
                        .setName('created-by')
                        .setDescription('The user who created this resource.')
                        .setRequired(true))
                .addAttachmentOption(option =>
                    option
                        .setName('file')
                        .setDescription('The file to upload.')
                        .setRequired(true))
                .addStringOption(option =>
                    option
                        .setName('name')
                        .setDescription('The name of the resource.')
                        .setRequired(true))
                .addStringOption(option =>
                    option
                        .setName('instructions')
                        .setDescription('Any instructions or notes for the resource (optional).'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('blender')
                .setDescription('Post a Blender resource.')
                .addUserOption(option =>
                    option
                        .setName('created-by')
                        .setDescription('The user who created this resource.')
                        .setRequired(true))
                .addAttachmentOption(option =>
                    option
                        .setName('file')
                        .setDescription('The file to upload.')
                        .setRequired(true))
                .addStringOption(option =>
                    option
                        .setName('name')
                        .setDescription('The name of the resource.')
                        .setRequired(true))
                .addStringOption(option =>
                    option
                        .setName('instructions')
                        .setDescription('Any instructions or notes for the resource (optional).'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('c4d')
                .setDescription('Post a Cinema 4D (C4D) resource.')
                .addUserOption(option =>
                    option
                        .setName('created-by')
                        .setDescription('The user who created this resource.')
                        .setRequired(true))
                .addAttachmentOption(option =>
                    option
                        .setName('file')
                        .setDescription('The file to upload.')
                        .setRequired(true))
                .addStringOption(option =>
                    option
                        .setName('name')
                        .setDescription('The name of the resource.')
                        .setRequired(true))
                .addStringOption(option =>
                    option
                        .setName('instructions')
                        .setDescription('Any instructions or notes for the resource (optional).'))
        ),
    async execute(interaction) {
        const subcommandGroup = interaction.options.getSubcommandGroup(false);  // Can be null if not part of a group
        const subcommand = interaction.options.getSubcommand();
        const creator = interaction.options.getUser('created-by');
        const file = interaction.options.getAttachment('file');
        let resourceName = interaction.options.getString('name');
        const instructions = interaction.options.getString('instructions') || 'No instructions provided.';

        // Capitalize the resource name
        resourceName = resourceName.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        const channelMapping = {
            'after-effects': {
                'presets': '1274853541168812073',
                'plugins': '1274754371858464808',
            },
            'panzoid': '1274853715890929756',
            'blender': '1274762628463464458',
            'c4d': '1274762649892294759',
        };

        const colorMapping = {
            'after-effects': {
                'presets': '#00005b',  // Dark Blue
                'plugins': '#FFD700',  // Gold
            },
            'panzoid': '#000000',  // Black
            'blender': '#ea7600',  // Orange
            'c4d': '#8A2BE2',      // Blue Violet
        };

        let targetChannelId;
        let color;

        if (subcommandGroup) {
            targetChannelId = channelMapping[subcommandGroup][subcommand];
            color = colorMapping[subcommandGroup][subcommand];
        } else {
            targetChannelId = channelMapping[subcommand];
            color = colorMapping[subcommand];
        }

        const targetChannel = interaction.guild.channels.cache.get(targetChannelId);

        if (!targetChannel) {
            await interaction.reply({ content: 'Error: Could not find the target channel.', ephemeral: true });
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle(resourceName)
            .setDescription(`**Created by:** ${creator}\n**Instructions:** ${instructions}`)
            .setColor(color)
            .setTimestamp();

        try {
            await targetChannel.send({ embeds: [embed], files: [new AttachmentBuilder(file.url, { name: file.name })] });
            const responseMessage = `**Resource Type:** ${subcommandGroup ? `${subcommandGroup} - ${subcommand}` : subcommand}\n**Created by:** ${creator}\n**Name:** ${resourceName}\n**Instructions:** ${instructions}`;
            await interaction.reply({ content: responseMessage, ephemeral: true });
        } catch (error) {
            console.error('Error sending message:', error);
            await interaction.reply({ content: 'Something went wrong while executing this command...', ephemeral: true });
        }
    }
};
