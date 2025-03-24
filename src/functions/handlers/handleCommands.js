const { SlashCommandBuilder, ChannelType } = require('discord.js')
// const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");
const path = require("path")

module.exports = (client) => {
  client.handleCommands = async () => {
    const commandFolders = fs.readdirSync(`./src/commands`);
    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(`./src/commands/${folder}`)
        .filter((file) => file.endsWith(".js"));

      const { commands, commandArray } = client;
      for (const file of commandFiles) {
        const command = require(`../../commands/${folder}/${file}`);
        commands.set(command.data.name, command);
        commandArray.push(command.data.toJSON());
        console.log(`Command: ${command.data.name} has been passed through the handler`)
      }
    }

    const clientId = "1275204271125827718";
    const guildId = "1273720168131854387";

    const tokenPath = path.resolve(__dirname, '/etc/secrets/TOKEN');
    let token;
    try {
      token = fs.readFileSync(tokenPath, 'utf8').trim();
    } catch (error) {
      console.error(`Error reading the token from ${tokenPath}:`, error);
      process.exit(1);
    }
    const rest = new REST({ version: "9" }).setToken(token);

    try {
      console.log("Started refreshing application (/) commands.");

      await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: client.commandArray,
      });
      console.log("Successfully reloaded application (/) commands.")
    } catch (error) {
      console.error(error);
    }
  };
};
