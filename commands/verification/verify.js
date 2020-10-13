const nanoid = require('nanoid');

module.exports = {
	args: false,
	guildOnly: true,
	memberPermission: 'SEND_MESSAGES',
	category: 'verification',
	name: 'verify',
	description: 'Set the verification message that members will see when running the verify command. Specify %e to make the message an embed.',
	usage: '',
	cooldown: 10,
	aliases: [],
	async run(message, args, db, helper) {
		const getVerifyChannel = await db.prepare('SELECT * FROM server_settings WHERE guild_id = ? AND setting_name = ?').get(message.guild.id, 'verify_channel');
		if(!getVerifyChannel || message.channel.id !== getVerifyChannel.setting_value) return;
		const getVerifyMessage = await db.prepare('SELECT * FROM server_settings WHERE guild_id = ? AND setting_name = ?').get(message.guild.id, 'verify_msg');
		if(!getVerifyMessage) return;

		const verifyPhrase = nanoid.nanoid(5);
		const verifyArray = getVerifyMessage.setting_value.split(/ +/g);

		if(verifyArray[0] === '%e') {
			const embedDesc = `${message.author.username},\n${verifyArray.slice(1).join(' ')}\n\nType: ${verifyPhrase} to join!`;
			message.channel.send(`<@${message.author.id}>`);
			helper.embed(message, { color: '#c9e0dd', description: embedDesc });
		}
		else {
			message.channel.send(`<@${message.author.id}>,\n${verifyArray.join(' ')}\n\nType: ${verifyPhrase} to join!`);
		}

		const filter = m => m.author.id === message.author.id;
		const options = {
			max: 1,
			time: 60000,
		};

		const awaitMsg = await message.channel.awaitMessages(filter, options);

		if(awaitMsg.size > 0) {
			const msgContent = awaitMsg.map(m => m.content);
			if(msgContent[0] === verifyPhrase) {
				return helper.verifyMember(message, db);
			}
			else {
				return helper.embed(message, { color: '#cc0000', description: `Error: <@${message.author.id}>, did not find correct verification code` });
			}
		}
		else {
			return helper.embed(message, { color: '#cc0000', description: `Error: Did not find any messages sent by <@${message.author.id}>` });
		}
	},
};
