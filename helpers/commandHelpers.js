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

		return message.member.roles.add(getRole.id);
	}
	catch(error) {
		if(error) throw error;
	}
};
