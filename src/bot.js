require('./pingServer');
const { sendBotData } = require('./sendBotData');
const fs = require('fs');
const express = require("express")
const app = express()
const path = require('path');
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { pingServer } = require('./pingServer');
const { memoryUsage, cpuUsage } = require('process');

// SERVER LOADING

const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
    res.send("Bot is running!");
});
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

// PING SERVER

pingServer();

// BOT LOADING

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
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// SEND BOT INFO

setInterval(() => {
    const guild = client.guilds.cache.first();
    const botData = {
        stats: {
            guildCount: client.guilds.cache.size,
            userCount: client.users.cache.size,
            uptime: Math.floor(process.uptime()),
        },
        performance: {
            memoryUsage: {
                rss: process.memoryUsage().rss / (1024 * 1024).toFixed(2),
                heapUsed: (process.memoryUsage().heapUsed / (1024 * 1024)).toFixed(2),
                heapTotal: (process.memoryUsage().heapTotal / (1024 * 1024)).toFixed(2),
            },
            cpuUsage: process.cpuUsage(),
            latency: client.ws.ping,
        },
        commands: {
            totalCommandsExecuted: client.totalCommandsExecuted || 0,
            topCommands: client.commandUsage || {},
        },
        errrors: {
            totalErrors: client.errorCount || 0,
            commonErrors: client.commonErrors || {},
        },
        serverStats: {
            memberBreakdown: {
                totalMembers: guild.memberCount,
                onlineMembers: guild.presences?.cache.filter(presence => presence.status !== 'offline').size || 0,
                roles: guild.roles.cache.map(role => ({
                    name: role.name,
                    count: role.members.size,
                })),
            },
            botRole: {
                name: guild.me.roles.highest.name,
                position: guild.me.roles.highest.position,
                permissions: guild.me.permissions.toArray(),
            },
            messages: client.messageCount || 0,    
        },
    };

    sendBotData(botData)
}, 5 * 60 * 1000);

// TRACK ERRORS

client.errorCount = 0;
client.commonErrors = {};
process.on("uncaughtException", (err) => {
    client.errorCount++;
    const errorName = err.name || "UnknownError";
    client.commonErrors[errorName] = (client.commonErrors[errorName] || 0) + 1;
    console.error("Uncaught Exception:", err);
});
process.on("unhandledRejection", (reason) => {
    client.errorCount++;
    const errorName = reason?.name || "UnhandledRejection";
    client.commonErrors[errorName] = (client.commonErrors[errorName] || 0) + 1;
    console.error("Unhandled Rejection:", reason);
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

setInterval(() => {
    client.messageCount = 0;
}, 5 * 60 * 1000);

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
