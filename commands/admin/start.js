const { SlashCommandBuilder } = require('discord.js');
const { request, Agent } = require('undici');
const { plexUrl, downPing } = require('../../config.json');
const { checkAdmin } = require('../../admin');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('start')
        .setDescription('stop running plex checks'),
    async execute(interaction) {
        // Check if allowed to run command
        if (!checkAdmin(interaction)) {
            interaction.reply('You don\'t have the correct role for this command');
            return;
        }

        if (global.running) return await interaction.reply('Already running');
        else await interaction.reply('Started');

        global.running = true;
        global.checkInterval = setInterval(async () => {
            // Check if the server is down
            try {
                const resp = await request(plexUrl + '/identity', {
                    dispatcher: new Agent({
                        headersTimeout: 1000,
                    }),
                });
                console.log('Plex Response', resp);
            } catch (e) {
                clearInterval(global.checkInterval);
                global.running = false;
                interaction.channel.send(`<@${downPing}> the plex is down, stopping auto checks.`);
            }

        }, 600000);
    },
};
