# Moderator Discord Bot
Advanced Discord Moderator Bot for Discord servers.

## Set up
To setup the bot do the following;
```sh
$ npm i
```
That will install all the packages this bot uses, then, edit the `./data.json` file, fill in the name of your bot, as well as your bot token.

## Running the bot
It is recommended that you run your Discord bot in a cloud server, to keep it running 24/7, and I would recommend one of the following,

- [Digital Ocean](https://digitalocean.com)
- [Vultr](https://vultr.com)

To start the *Discord Bot*, run the following;
```sh
$ node index.js // make sure you have nodejs installed!
```

Then your bot is ready!

## Commands
In your server, run `!list` and you will see a list of commands!

## Roles

To run Admin/Moderator commands, you need the "`+`" role or the "`Moderator`" role in the Discord Server, and make sure you also have a "`Community`" role, the bot auto assigns it when a member joins, and with that role you can run the basic commands. Look at `/main.js` for more.
