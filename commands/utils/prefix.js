module.exports = {
	args: true,
	guildOnly: true,
	memberPermission: 'ADMINISTRATOR',
	category: 'utils',
	name: 'prefix',
	description: 'Set the guild\'s individual prefix',
	usage: '<new_prefix>',
	cooldown: 10,
	aliases: [],
	async run(message, args, db, helper) {
		const newPrefix = args[0];

		try {
			const getPreviousMsg = await db.prepare('SELECT * FROM servers WHERE guild_id = ?').get(message.guild.id);

			if(getPreviousMsg) {
				await db.prepare('INSERT OR REPLACE INTO servers (id, guild_id, prefix) VALUES (?, ?, ?)').run(getPreviousMsg.id, message.guild.id, newPrefix);
			}
			else {
				await db.prepare('INSERT OR REPLACE INTO servers (guild_id, prefix) VALUES (?, ?)').run(message.guild.id, newPrefix);
			}
		}
		catch(error) {
			if(error) throw error;
		}

		return helper.embed(message, { color: '#c9e0dd', description: `Success! The prefix has been changed to:\n\n${newPrefix}` });
	},
};
