require("dotenv").config();

const { encodedToken } = process.env;
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");

const token = Buffer.from(encodedToken, 'base64').toString('utf8');

console.log("TOKEN from environment:", process.env.TOKEN);
console.log(token)

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
    ],
});

client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();
client.commandArray = [];
client.colour = "#2c9bc7";

const functionFolders = fs.readdirSync(`./src/functions`);
for (const folder of functionFolders) {
  const functionFiles = fs
    .readdirSync(`src/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of functionFiles)
    require(`./functions/${folder}/${file}`)(client);
}

client.handleEvents();
client.handleCommands();
client.handleComponents();


client.on('interactionCreate', async interaction => {
    if(interaction.isButton()) {
        const button = client.buttons.get(interaction.customId.split(':')[0]);
        if (!button) return;
        try {
            await button.execute(interaction);
        } catch (error) {
            console.error(error)
            await interaction.reply({ content: 'There was an error handling this button!', ephemeral: true })
        }
    }
})

client.login(token);
