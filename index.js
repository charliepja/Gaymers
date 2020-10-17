require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');
const clientHelper = require('./helpers/clientHelpers.js');
const commandHelper = require('./helpers/commandHelpers.js');
const db = require('./seeds.js');

const client = new Discord.Client({ fetchAllMembers: true });
const cooldowns = new Discord.Collection();

client.commands = new Discord.Collection();
client.utils = new Discord.Collection();
client.verification = new Discord.Collection();
client.welcome = new Discord.Collection();

const modules = fs.readdirSync(path.resolve('commands'));

clientHelper.generateCommands(client.commands, client.utils, 'utils');
clientHelper.generateCommands(client.commands, client.verification, 'verification');
clientHelper.generateCommands(client.commands, client.welcome, 'welcome');

client.on('ready', async () => {
	console.log('Hello World!');
	try {
		await clientHelper.generateDB(modules, db);
	}
	catch(error) {
		if(error) throw error;
	}
});

client.on('guildCreate', async (guild) => {
	await clientHelper.createEntry(guild.id, modules, db);
});

client.on('guildMemberAdd', async (member) => {
	const getNonVerifiedRole = await member.guild.roles.resolve('762328511796346881');
	member.roles.add(getNonVerifiedRole);
	const getWelcomeChannel = await db.prepare('SELECT * FROM server_settings WHERE guild_id = ? AND setting_name = ?').get(member.guild.id, 'welcome_channel');
	if(!getWelcomeChannel) return;
	const welcomeChannel = await member.guild.channels.resolve(getWelcomeChannel.setting_value);
	if(!welcomeChannel) return;
	const getWelcomeMsg = await db.prepare('SELECT * FROM server_settings WHERE guild_id = ? AND setting_name = ?').get(member.guild.id, 'welcome_msg');
	if(!getWelcomeMsg) return;
	const welcomeMsg = getWelcomeMsg.setting_value;

	const welcomeArray = welcomeMsg.split(/ +/g);

	if(welcomeArray[0] === '%e') {
		const embed = new Discord.MessageEmbed()
			.setColor('#c9e0dd')
			.setDescription(welcomeArray.slice(1).join(' '))
			.setTimestamp();

		welcomeChannel.send(`<@${member.id}>`, { embed: embed });
	}
	else {
		welcomeChannel.send(`<@${member.id}>,\n${welcomeArray.join(' ')}`);
	}
});

client.on('message', async (message) => {
	if(message.author.bot) return;
	if(message.channel.type !== 'text') return;

	const getPrefix = await db.prepare('SELECT * FROM servers WHERE guild_id = ?').get(message.guild.id);
	let prefix;

	if(getPrefix) {
		prefix = getPrefix.prefix;
	}
	else {
		prefix = '!';
	}

	const split = message.content.split(/ +/g);
	const commandName = split[0].slice(prefix.length).toLowerCase();
	const args = split.slice(1);

	if(!message.content.startsWith(prefix) && !message.mentions.users.has(message.client.user.id)) return;

	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if(!command) return;

	const checks = await clientHelper.commandCheck(command, message, args);

	if(checks) return;

	if(!cooldowns.has(commandName)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 5) * 1000;

	if(timestamps.has(message.author.id)) {
		const expiryTime = timestamps.get(message.author.id) + cooldownAmount;

		if(now < expiryTime) {
			const timeLeft = (expiryTime - now) / 1000;
			return commandHelper.embed(message, { color: '#c9e0dd', description: `Please wait ${timeLeft.toFixed(1)} more second(s) before re-using ${command.name}!` });
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		return command.run(message, args, db, commandHelper, db);
	}
	catch(error) {
		console.log(error);
		if(error) throw error;
	}
});

client.login(process.env.TOKEN);
