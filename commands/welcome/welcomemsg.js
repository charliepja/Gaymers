module.exports = {
	args: true,
	guildOnly: true,
	memberPermission: 'ADMINISTRATOR',
	category: 'welcome',
	name: 'welcomemsg',
	description: 'Set the verification message that members will see when running the verify command. Specify %e to make the message an embed.',
	usage: '%e <message>',
	cooldown: 10,
	aliases: ['welcome-msg', 'wmsg'],
	async run(message, args, db, helper) {
		const verifyMsg = args.join(' ');

		try {
			const getPreviousMsg = await db.prepare('SELECT * FROM server_settings WHERE setting_name = ? AND guild_id = ?').get('welcome_msg', message.guild.id);

			if(getPreviousMsg && getPreviousMsg.setting_value) {
				await db.prepare('INSERT OR REPLACE INTO server_settings (id, guild_id, setting_name, setting_value) VALUES (?, ?, ?, ?)').run(getPreviousMsg.id, message.guild.id, 'welcome_msg', verifyMsg);
			}
			else {
				await db.prepare('INSERT OR REPLACE INTO server_settings (guild_id, setting_name, setting_value) VALUES (?, ?, ?)').run(message.guild.id, 'welcome_msg', verifyMsg);
			}
		}
		catch(error) {
			if(error) throw error;
		}

		return helper.embed(message, { color: '#c9e0dd', description: `Success! The welcome message has been changed to:\n\n${verifyMsg}` });
	},
};
