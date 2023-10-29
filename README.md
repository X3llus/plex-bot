# plex-bot

This is the plex bot I built for a friend to take media requests and notify him when his plex was down. Hosting for free on google cloud and using json file to store the requests.

## Setup

- Create a config.json with the following:
  - token
  - clientId
  - plexUrl
  - XPlexToken
  - roles (list)
- Create a data.json file with the following content: `[]`
- `npm run commands` to push the commands
- `npm run start` to start the bot
