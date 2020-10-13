const fs = require('fs');
const path = require('path');

module.exports.generateCommands = async (cmdCollection, collection, commandFolder) => {
	const commandFile = fs.readdirSync(path.resolve('commands', commandFolder)).filter(file => file.endsWith('.js'));
	for (const file of commandFile) {
		const command = require(path.resolve('commands', commandFolder, file));
		collection.set(command.name, command);
		cmdCollection.set(command.name, command);
	}
};

module.exports.commandCheck = async (command, message, args) => {
	if(command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;
		if(command.usage) {
			reply += `\nThe correct usage is: \`${command.name} ${command.usage}\``;
		}
		return message.channel.send(reply) && true;
	}

	if(!message.member.hasPermission(command.memberPermission)) {
		return message.reply(`I can't run this command! You need the following permission: ${command.memberPermission}`) && true;
	}

	return false;
};

module.exports.getCommands = async (module_name) => {
	const commands = [];
	const commandFiles = fs.readdirSync(path.resolve('commands', module_name)).filter(file => file.endsWith('.js'));

	for(const file of commandFiles) {
		const getCommand = require(path.resolve('commands', module_name, file));
		commands.push(getCommand.name);
	}

	return commands;
};

module.exports.generateDB = async (modules, db) => {
	for(const m of modules) {
		const doesExist = await db.prepare('SELECT * FROM modules WHERE  module_name = ?').get(m);

		if(!doesExist) {
			await db.prepare('INSERT INTO modules (module_name) VALUES (?)').run(m);
		}

		const moduleID = await db.prepare('SELECT module_id FROM modules WHERE module_name = ?').get(m);
		const moduleCmds = await this.getCommands(m);

		for(const cmd of moduleCmds) {
			const doesCmdExist = await db.prepare('SELECT * FROM commands WHERE module_id = ? AND command_name = ?').get(moduleID.module_id, cmd);

			if(!doesCmdExist) {
				await db.prepare('INSERT INTO commands (command_name, module_id) VALUES (?, ?)').run(cmd, moduleID.module_id);
			}
		}
	}
};

module.exports.createEntry = async (guildID, modules, db) => {
	try {
		await db.prepare('INSERT INTO servers (guild_id) VALUES (?)').run(guildID);
	}
	catch(error) {
		if(error) throw error;
	}

	for(const m of modules) {
		try {
			const moduleID = await db.prepare('SELECT module_id FROM modules WHERE module_name = ?').get(m);
			const moduleCmds = await this.getCommands(m);

			await db.prepare('INSERT INTO server_modules (guild_id, module_id) VALUES (?, ?)').run(guildID, moduleID.module_id);

			for(const cmd of moduleCmds) {
				const cmdID = await db.prepare('SELECT * FROM commands WHERE module_id = ? AND command_name = ?').get(moduleID.module_id, cmd);
				await db.prepare('INSERT INTO server_commands (command_id, guild_id) VALUES (?, ?)').run(cmdID.command_id, guildID);
			}
		}
		catch(error) {
			if(error) throw error;
		}
	}
};
