const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('stop running plex checks'),
    async execute(interaction) {
        // Check if allowed to run command
        if (!interaction.member.roles.cache.has('1167949158334873600')) {
            interaction.reply('You don\'t have the correct role for this command');
            return;
        }

        if (global.running) {
            clearInterval(global.checkInterval);
            global.running = false;
            await interaction.reply('Stopped!');
        } else {
            await interaction.reply('Not currently running!');
        }
    },
};
