# Gaymers

Gaymers is a discord bot built using the discod.js framework for The Haven Inc's gaming server. The bot is currently a WIP with limited scope in functionality, but does have the following modules developed:

* Verification Module
* Welcome Message Module


# Getting Started

To obtain a copy of this project on your local machine simply clone this repository with your preferred method. More details of this can be found [Here](https://docs.github.com/en/github/using-git/which-remote-url-should-i-use)

## Prerequisites

In order to run this project you will need to have the following software:

```

node v12.x.x

npm v6.x.x

Both can be obtained by downloading node [here](https://nodejs.org/en/download/)

```
To check what version of the software you are running, run `node -v` and `npm -v` in your chosen terminal.

## Installing

After installing node and npm, navigate to your project folder in your terminal.

To install all the npm modules run:

```
npm install

```

To create a `.env` file:

```
Create a new file at the root of your project directory called .env

Copy the keys from .env_example

```

## Deployment

First create a bot application at https://discord.com/developers/applications/

Click `New Application` and give your application a name of your choosing, then press `create`

That will take you to the general information page of your new application, on the left hand side press `Bot` then `Add Bot`

Here you can give your bot application a different username or a profile picture, however the important part is the `bot token`

Click `Copy` which is located under `Token` and paste that value into `TOKEN` that is located in the `.env` file. It is important that this is never shared with anyone.

Then on the left hand side click `OAuth2`, and under `scopes` check `bot` under `bot permissions` you can choose which permissions you require a bot to have in a guild for it to function. The minimum that Fox will require to work is `View Channels`, `Send Messages`, and `Read Message History`

Then under `scopes` copy the url and proceed to that url where you can select which guild you wish the bot to join. Press `continue` and then `Authorize`

The bot is now added to the guild, and the next thing to do is bring the bot online.

For the bot to stay on 24/7 it is recommended to use a VPS or a Dedicated Server, otherwise your local machine will need to stay on 24/7.

To bring the bot online on your local machine you can simply run the following command in your terminal `npm run bot` or use a process manager of your choice.

## Built With

* discord.js
* better-sqlite3

## Contributing

All contributes are welcome, this is an open source project and contributing guidelines will follow

## Author

* Charlie Anderson

## License

This project is licensed under GNU GPLv3 --- See LICENSE.md for more details
