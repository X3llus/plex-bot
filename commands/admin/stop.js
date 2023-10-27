const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('stop running plex checks'),
    async execute(interaction) {
        if (global.running) {
            clearInterval(global.checkInterval);
            global.running = false;
            await interaction.reply('Stopped!');
        } else {
            await interaction.reply('Not currently running!');
        }
    },
};