const { SlashCommandBuilder } = require('discord.js');
const { request, Agent } = require('undici');
const { plexUrl } = require('../../config.json');

// rest of your code here
module.exports = {
    data: new SlashCommandBuilder()
        .setName('check')
        .setDescription('start running the plex checks.'),
    async execute(interaction) {
        let resp;
        try {
            resp = await request(plexUrl, {
                dispatcher: new Agent({
                    headersTimeout: 1000,
                }),
            });
            interaction.channel.send(`${interaction.member} the plex is up`);
        } catch (e) {
            interaction.channel.send(`${interaction.member} the plex is down`);
        }

        if (global.running) return await interaction.reply('Already running');
        else await interaction.reply('Started');

        global.running = true;
        global.checkInterval = setInterval(async () => {
            // Check if the server is down
            try {
                resp = await request(plexUrl, {
                    dispatcher: new Agent({
                        headersTimeout: 1000,
                    }),
                });
            } catch (e) {
                clearInterval(global.checkInterval);
                global.running = false;
                interaction.channel.send(`${interaction.member} the plex is down, stopping auto checks.`);
            }

        }, 600000);
    },
};