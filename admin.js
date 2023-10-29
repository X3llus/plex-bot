const { roles } = require('./data.json');

async function checkAdmin(interaction) {
    let allow = false;
    for (const role in roles) {
        if (interaction.member.roles.cache.has(role)) {
            allow = true;
        }
    }
    return allow;
}

module.exports = {
    checkAdmin,
};