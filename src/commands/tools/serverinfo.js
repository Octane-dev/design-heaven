const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Provides detailed information about the server.'),
  async execute(interaction) {
    const guild = interaction.guild;

    // Fetch owner
    const owner = await guild.fetchOwner();
    
    // Create an embed
    const serverInfoEmbed = new EmbedBuilder()
      .setColor('#0099ff')  // Set the color of the embed
      .setTitle('Server Information')
      .setDescription(`Detailed information about the server.`)
      .addFields(
        { name: 'Server Name', value: guild.name, inline: true },
        { name: 'Server ID', value: guild.id, inline: true },
        { name: 'Owner', value: owner.user.tag, inline: true },
        { name: 'Total Members', value: guild.memberCount.toString(), inline: true },
        { name: 'Created At', value: guild.createdAt.toDateString(), inline: true },
        { name: 'Region', value: guild.preferredLocale, inline: true },
        { name: 'Verification Level', value: guild.verificationLevel.toString(), inline: true },
        { name: 'Roles', value: guild.roles.cache.size.toString(), inline: true },  // Display role count instead of names
        { name: 'Channels', value: guild.channels.cache.size.toString(), inline: true },  // Display channel count instead of names
        { name: 'Emojis', value: guild.emojis.cache.size.toString(), inline: true },  // Display emoji count instead of actual emojis
        { name: 'Boosts', value: guild.premiumSubscriptionCount.toString(), inline: true }
      )
      .setTimestamp()  // Adds a timestamp to the embed
      .setFooter({ text: 'Server Info' });

    await interaction.reply({ embeds: [serverInfoEmbed], ephemeral: true });
  },
};
