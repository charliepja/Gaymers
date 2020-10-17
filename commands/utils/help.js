const fs = require('fs');
const path = require('path');

module.exports = {
	args: false,
	guildOnly: true,
	memberPermission: 'SEND_MESSAGES',
	category: 'utils',
	name: 'help',
	description: 'View the help command, cool right?',
	usage: '',
	cooldown: 5,
	aliases: [],
	async run(message, args, db, helper) {
		const modules = fs.readdirSync(path.resolve('commands'));
		if(args.length > 0) {
			const choice = args[0].toLowerCase();
			if(modules.includes(choice)) {
				const getModule = fs.readdirSync(path.resolve('commands', choice));
				const strModule = [];

				for(const m of getModule) {
					const filename = m.split('.');
					await strModule.push(filename[0]);
				}

				return helper.embed(message, { color: '#c9e0dd', description: `Module ${choice} has the following commands:\n\n${strModule.join('\n')}` });
			}
			else {
				const commands = message.client.commands;
				const getCommand = commands.get(choice) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(choice));
				if(!getCommand) {
					return helper.embed(message, { color: '#c9e0dd', description: `Error: ${choice} is not a valid module or command for this bot!` });
				}
				return helper.embed(message, { color: '#c9e0dd', description: `Command Name: ${getCommand.name}\nDescription: ${getCommand.description}\nModule: ${getCommand.category}\nUsage: ${getCommand.usage}\nAliases: ${getCommand.aliases.join(' ')}\nPermission: ${getCommand.memberPermission}` });
			}
		}
		else {
			return helper.embed(message, { color: '#c9e0dd', description: `To get started, either supply a command or a module in the following format: \`-help <command/module>\`\n
			The following modules are available:\n${modules.join('\n')}\n\nSupplying a module will show all commands in that module!` });
		}
	},
};
