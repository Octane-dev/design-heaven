const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Gets the avatar of a user - leave blank to get your own')
        .addUserOption( option =>
                option
                    .setName('user')
                    .setDescription('the target')
        ),

        async execute(client,interaction) {
            const target = interaction.options.getUser('user') || interaction.user
            const avatarURL = target.displayAvatarURL({ dynamic: true, size: 512 });
        
            await interaction.reply(`${target.tag}'s avatar: ${avatarURL}`);
        }
}