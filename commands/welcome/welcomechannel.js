module.exports = {
	args: true,
	guildOnly: true,
	memberPermission: 'ADMINISTRATOR',
	category: 'welcome',
	name: 'welcomechannel',
	description: 'Set the verification message that members will see when running the verify command. Specify %e to make the message an embed.',
	usage: '%e <message>',
	cooldown: 10,
	aliases: ['welcome-channel'],
	async run(message, args, db, helper) {
		const verifyChannel = await message.guild.channels.resolve(args[0]);
		if(!verifyChannel) return helper.embed(message, { color: '#cc0000', description: 'Error: Cannot find channel within server' });

		const doesExist = await db.prepare('SELECT * FROM server_settings WHERE setting_name = ? AND guild_id = ?').get('welcome_channel', message.guild.id);

		if(doesExist && doesExist.length > 0) {
			await db.prepare('INSERT OR REPLACE INTO server_settings (id, guild_id, setting_name, setting_value) VALUES (?, ?, ?, ?)').run(doesExist.id, message.guild.id, 'welcome_channel', args[0]);
		}
		else {
			await db.prepare('INSERT INTO server_settings (guild_id, setting_name, setting_value) VALUES (?, ?, ?)').run(message.guild.id, 'welcome_channel', args[0]);
		}

		return helper.embed(message, { color: '#c9e0dd', description: `Success! Welcome channel set to: <#${args[0]}>` });
	},
};
