const { MessageEmbed } = require('discord.js');

module.exports.embed = async (message, options) => {
	const embed = new MessageEmbed()
		.setColor(options.color)
		.setDescription(options.description)
		.setTimestamp();

	return message.channel.send({ embed: embed });
};

module.exports.verifyMember = async (message, db) => {
	try {
		const getVerifiedRole = await db.prepare('SELECT * FROM server_settings WHERE guild_id = ? AND setting_name = ?').get(message.guild.id, 'verify_role');
		if(!getVerifiedRole) return this.embed(message, { color: '#cc0000', description: 'Error: Verification role has not been set up' });
		const getRole = message.guild.roles.resolve(getVerifiedRole.setting_value);
		if(!getRole) return this.embed(message, { color: '#cc0000', description: 'Error: Cannot find verification role!' });

		const getNonVerifiedRole = await message.guild.roles.resolve('762328511796346881');
		message.member.roles.remove(getNonVerifiedRole);

		return message.member.roles.add(getRole.id);
	}
	catch(error) {
		if(error) throw error;
	}
};

module.exports.createResponseQuestion = async (message, question, channelToSend, filter) => {
	// Creates question
	// waits for response
	// returns response

	// Does Channel Exist?
	const suppliedChannel = await message.client.channels.resolve(channelToSend);
	if(!suppliedChannel) return;

	// Does Question Exist?
	if(question.length <= 0) return;

	// Set Filter
	const questionFilter = filter || (m => m.author.id === message.author.id);

	const questionEmbed = new MessageEmbed()
		.setColor('#919b57')
		.setDescription(question)
		.setTimestamp();

	suppliedChannel.send({ embed: questionEmbed });

	const messageCollector = await suppliedChannel.awaitMessages(questionFilter, { max: 1, time: 120000 });
	if(messageCollector && messageCollector.size > 0) {
		const firstResponse = messageCollector.first();
		return firstResponse.content;
	}

	return;
};
