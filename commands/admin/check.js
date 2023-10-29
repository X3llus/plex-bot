const { SlashCommandBuilder } = require('discord.js');
const { request, Agent } = require('undici');
const { plexUrl } = require('../../config.json');

// rest of your code here
module.exports = {
    cooldown: 60,
    data: new SlashCommandBuilder()
        .setName('check')
        .setDescription('start running the plex checks.'),
    async execute(interaction) {
        console.log('running check');
        try {
            const resp = await request(plexUrl + '/identity', {
                dispatcher: new Agent({
                    headersTimeout: 1000,
                }),
            });
            console.log('Plex Response', resp);
            interaction.reply('the plex is up');
        } catch (e) {
            interaction.reply('the plex is down');
        }
    },
};
