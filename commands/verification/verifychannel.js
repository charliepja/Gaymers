module.exports = {
	args: true,
	guildOnly: true,
	memberPermission: 'ADMINISTRATOR',
	category: 'verification',
	name: 'verifychannel',
	description: 'Set the verification channel that members will be required to verify in!',
	usage: '<channel_id>',
	cooldown: 10,
	aliases: ['verify-channel'],
	async run(message, args, db, helper) {
		const verifyChannel = await message.guild.channels.resolve(args[0]);
		if(!verifyChannel) return helper.embed(message, { color: '#cc0000', description: 'Error: Cannot find channel within server' });

		const doesExist = await db.prepare('SELECT * FROM server_settings WHERE setting_name = ? AND guild_id = ?').get('verify_channel', message.guild.id);

		if(doesExist && doesExist.length > 0) {
			await db.prepare('INSERT OR REPLACE INTO server_settings (id, guild_id, setting_name, setting_value) VALUES (?, ?, ?, ?)').run(doesExist.id, message.guild.id, 'verify_channel', args[0]);
		}
		else {
			await db.prepare('INSERT INTO server_settings (guild_id, setting_name, setting_value) VALUES (?, ?, ?)').run(message.guild.id, 'verify_channel', args[0]);
		}

		return helper.embed(message, { color: '#c9e0dd', description: `Success! Verification channel set too: <#${args[0]}>` });
	},
};
