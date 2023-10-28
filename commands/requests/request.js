const { SlashCommandBuilder } = require('discord.js');
const { writeData } = require('../../db.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('request')
        .setDescription('request new media to be added to plex.')
        .addStringOption(option => option.setName('title_year')
        .setDescription('The name of the movie/show and the year.')
        .setRequired(true)),
    async execute(interaction) {
        writeData({
            'member': interaction.member,
            'title_year': interaction.options.getString('title_year'),
        });
        await interaction.reply('Adding ' + interaction.options.getString('title_year') + ' to requests!');
    },
};