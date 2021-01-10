const { MessageEmbed } = require('discord.js');

module.exports = {
	args: false,
	guildOnly: true,
	settings: false,
	memberPermission: 'MANAGE_MESSAGES',
	category: 'staffapps',
	name: 'link-app',
	description: 'Sends an embed message to the staff application channel',
	usage: '',
	cooldown: 5,
	aliases: ['linkapp'],
	async run(message, args, db, helper) {
		try {
			const applicationChannel = await message.client.channels.resolve('797905223574093834');
			if(!applicationChannel) return helper.embed(message, { color: '#a2f1a2', description: 'Error: Cannot find application channel!' });
			const filter = m => m.author.id === message.author.id;
			const appPosition = await helper.createResponseQuestion(message, 'Please provide the title of the staff position this application is for', message.channel.id, filter);
			const appDescription = await helper.createResponseQuestion(message, 'Please provide the description of this role (one message)', message.channel.id, filter);
			const appURL = await helper.createResponseQuestion(message, 'Please provide the URL to this application', message.channel.id, filter);

			const embed = new MessageEmbed()
				.setColor('#98fb98')
				.setDescription(`**Title**\n${appPosition}\n\n**Role Description**\n${appDescription}\n\n**Application Link:** ${appURL}`);

			applicationChannel.send({ embed: embed });

			return helper.embed(message, { color: '#a2f1a2', description: 'Success! Application has been posted!' });
		}

		catch(error) {
			console.log(error);
		}
	},
};