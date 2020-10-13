module.exports = {
	args: true,
	guildOnly: true,
	memberPermission: 'ADMINISTRATOR',
	category: 'verification',
	name: 'verifyrole',
	description: 'Set the verification role that members will receive after verifying themselves',
	usage: '<role_id>',
	cooldown: 10,
	aliases: ['verify-role'],
	async run(message, args, db, helper) {
		const verifyRole = await message.guild.roles.resolve(args[0]);
		if(!verifyRole) return helper.embed(message, { color: '#cc0000', description: 'Error: Cannot find role within server' });

		const doesExist = await db.prepare('SELECT * FROM server_settings WHERE setting_name = ?').get('verify_role');

		if(doesExist && doesExist.length > 0) {
			await db.prepare('INSERT OR REPLACE INTO server_settings (id, guild_id, setting_name, setting_value) VALUES (?, ?, ?, ?)').run(doesExist.id, message.guild.id, 'verify_role', args[0]);
		}
		else {
			await db.prepare('INSERT INTO server_settings (guild_id, setting_name, setting_value) VALUES (?, ?, ?)').run(message.guild.id, 'verify_role', args[0]);
		}

		return helper.embed(message, { color: '#c9e0dd', description: `Success! Verification role set to: <@&${args[0]}>` });
	},
};
