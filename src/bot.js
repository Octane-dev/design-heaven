require('./pingServer');
const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits } = require("discord.js");

const tokenPath = path.resolve(__dirname, '/etc/secrets/TOKEN');
let token;

try {
    token = fs.readFileSync(tokenPath, 'utf8').trim();
    if (!token) throw new Error('Token file is empty.');
} catch (error) {
    console.error('Failed to load token from file:', error.message);
    process.exit(1);
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
    ],
});

// Bot collections
client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();
client.commandArray = [];
client.colour = "#2c9bc7";

// Load functions dynamically
const functionFolders = fs.readdirSync(`./src/functions`);
for (const folder of functionFolders) {
    const functionFiles = fs
        .readdirSync(`src/functions/${folder}`)
        .filter((file) => file.endsWith(".js"));
    for (const file of functionFiles) {
        require(`./functions/${folder}/${file}`)(client);
    }
}

// Attach handlers
client.handleEvents();
client.handleCommands();
client.handleComponents();

// Handle button interactions
client.on('interactionCreate', async interaction => {
    if (interaction.isButton()) {
        const button = client.buttons.get(interaction.customId.split(':')[0]);
        if (!button) return;
        try {
            await button.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error handling this button!', ephemeral: true });
        }
    }
});

// Start the bot
client.login(token);
