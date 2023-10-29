const { SlashCommandBuilder } = require('discord.js');
const { deleteData } = require('../../db.js');
const { checkAdmin } = require('../../admin');

// rest of your code here
module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear the requests.'),
    async execute(interaction) {
        // Check if allowed to run command
        if (!checkAdmin(interaction)) {
            await interaction.reply('You don\'t have the correct role for this command');
            return;
        }
        await interaction.reply({ content: 'Clearing the requests.', ephemeral: true });
        await deleteData();
    },
};
