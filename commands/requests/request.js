/* eslint-disable no-unused-vars */
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const { writeData } = require('../../db.js');
const { request, Agent } = require('undici');
const { plexUrl, XPlexToken } = require('../../config.json');

const fs = require('node:fs').promises;

const xml2js = require('xml2js');
const parser = new xml2js.Parser();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('request')
        .setDescription('request new media to be added to plex.')
        .addStringOption(option => option.setName('title')
            .setDescription('The name of the movie/show.')
            .setRequired(true)),
    async execute(interaction) {
        // Search plex for movie
        let resp;
        try {
            resp = await request(plexUrl + `/hubs/search/?query=${interaction.options.getString('title')}&X-Plex-Token=${XPlexToken}`, {
                dispatcher: new Agent({
                    headersTimeout: 1000,
                }),
            });
        } catch (e) {
            console.log(e);
            interaction.reply('An error has occured.');
            return;
        }

        // Parse the response from the server
        const body = await resp.body.text();
        const result = await parser.parseStringPromise(body);

        const hubs = result?.MediaContainer?.Hub || [];

        const titles = [];
        const maxTitles = 3;

        // Extract titles from Movies or Shows hubs
        for (const hub of hubs) {
            const hubTitle = hub.$.title;
            if (hubTitle === 'Movies' || hubTitle === 'Shows') {
                const videos = hub.Video || [];
                for (let i = 0; i < Math.min(maxTitles, videos.length); i++) {
                    titles.push(videos[i].$.title);
                }
            }
        }

        // If there are no results, default to adding request
        if (titles.length <= 0) {
            interaction.reply('Adding ' + interaction.options.getString('title') + ' to requests!');
            writeData({
                'member': interaction.member,
                'title': interaction.options.getString('title'),
            });
            return;
        }

        // Create buttons for each title dynamically
        const buttons = titles.map(title => {
            return new ButtonBuilder()
                .setCustomId(title)
                .setLabel(title)
                .setStyle(ButtonStyle.Primary);
        });

        const buttonNo = new ButtonBuilder()
            .setCustomId('no')
            .setLabel('No')
            .setStyle(ButtonStyle.Danger);

        buttons.push(buttonNo);

        const row = new ActionRowBuilder()
            .addComponents(...buttons);

        const response = await interaction.reply({
            content: 'Is the requested title one of the below?',
            components: [row],
            ephemeral: true,
        });

        // After response
        const collectorFilter = i => i.user.id == interaction.user.id;

        try {
            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });

            if (confirmation.customId === 'no') {
                // Add request to file
                writeData({
                    'member': interaction.member,
                    'title': interaction.options.getString('title'),
                });
                await confirmation.update({ content: 'Adding ' + interaction.options.getString('title') + ' to requests!', components: [], ephemeral: true });
            } else {
                await confirmation.update({ content: `${confirmation.customId} is already in the library!`, components: [], ephemeral: true });
            }
        } catch (e) {
            await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
        }
    },
};
