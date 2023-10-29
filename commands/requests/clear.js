const { SlashCommandBuilder } = require('discord.js');
const { deleteData } = require('../../db.js');

// rest of your code here
module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear the requests.'),
    async execute(interaction) {
        // Check if allowed to run command
        if (!interaction.member.roles.cache.has('1167949158334873600')) {
            await interaction.reply('You don\'t have the correct role for this command');
            return;
        }
        await interaction.reply({ content: 'Clearing the requests.', ephemeral: true });
        await deleteData();
        await interaction.followUp({ content: 'Cleared', ephemeral: true });
    },
};
