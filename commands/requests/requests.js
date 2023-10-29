const { SlashCommandBuilder } = require('discord.js');
const { readData } = require('../../db.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('requests')
        .setDescription('list all current requests.')
        .addBooleanOption(option => option.setName('show_requester')
        .setDescription('Only show the titles of what was requested, not who requested it.')),
    async execute(interaction) {
        let outString = '';
        const jsonData = await readData();

        if (interaction.options.getBoolean('show_requester')) {
            jsonData.forEach(request => {
                outString += `${request.member.displayName} requested **${request.title}**\n`;
            });
        } else {
            jsonData.forEach(request => {
                outString += `**${request.title}**\n`;
            });
        }

        interaction.reply(outString);
    },
};
