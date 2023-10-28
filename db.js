const fs = require('node:fs').promises;

let currentData = [];

/**
 * Gets the data from the json file
 * @returns {Promise<Array<Map<string, string>>>} The current file data
 */
async function readData() {
    const data = await fs.readFile('data.json');
    currentData = JSON.parse(data);
    return currentData;
}

/**
 * Adds new data to the json file
 * @param {Map<String, String>} data New data to be added
 */
async function writeData(data) {
    currentData.push(data);
    await fs.writeFile('data.json', JSON.stringify(currentData));
}

async function deleteData() {
    currentData = [];
    await fs.writeFile('data.json', JSON.stringify(currentData));
}

module.exports = { readData, writeData, deleteData };
