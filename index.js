const { time } = require('console');
const { Client, Intents } = require('discord.js');
const fs = require('fs');
const NekoClient = require('nekos.life');
const neko = require('nekos.life');
const nekoClient = new neko();
require('dotenv').config;

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
	],
});

const PREFIX = ';';
const botAuthor = '676503697252941856';

client.on('ready', () => {
	console.log('Bot is ready!   ' + client.user.tag);

	const arrayOfStatus = [
		'OwO',
		'UnU',
		'OnO',
		'UwU',
		'^w^',
		'<3',
		'Prefix is ;',
	];
	let index = 0;
	setInterval(() => {
		if (index === arrayOfStatus.length) index = 0;
		const status = arrayOfStatus[index];
		client.user.setPresence({
			activity: {
				name: status,
				type: 'STREAMING',
				url: 'https://www.twitch.tv/peety_uwu',
			},
			status: 'idle',
		});
		index++;
	}, 7000);
});

client.on('messageCreate', async (message) => {
	if (message.author.bot) return;

	const args = message.content.slice(PREFIX.length).split(/ +/);
	const command = args.shift().toLowerCase();
	const channel = message.channel;
	const author = message.author;

	if (!message.content.startsWith(PREFIX)) return;

	if (command == 'hi') {
		channel.send(`Hello ${message.author}`);
	}
	if (command == 'rdnumber') {
		let number = Math.round(Math.random() * 100);
		channel.send(`Your random number is ${number}`);
	}
	if (command == 'kiss') {
		let gif = await nekoClient.kiss();
		let embed = new Discord.MessageEmbed();
		embed.setDescription(`${author} kisses ${args.join(' ')}`);
		embed.setImage(gif.url);
		embed.setAuthor(
			'Peety',
			'https://i.imgur.com/qRFFT4T.jpg',
			'https://www.twitch.tv/peety_uwu'
		);
		embed.setTimestamp(new Date());
		embed.setColor('#ff0000');
		channel.send(embed);
	}
	if (command == 'marry') {
		let marry =
			JSON.parse(fs.readFileSync('./database/marry.json')).length <= 0
				? [{ ask: '676503697252941856', accept: '880788984157073479' }]
				: JSON.parse(fs.readFileSync('./database/marry.json'));
		let mention = message.mentions.users.first();
		if (!mention) {
			return channel.send('Please mention someone!');
		}
		if (mention.id == author.id) {
			return channel.send("You can't marry yourself");
		}
		for (let m of marry) {
			if (m.accept == mention.id) {
				return channel.send(
					`${mention} is already married to <@${m.ask}>`
				);
			} else if (m.ask == mention.id) {
				return channel.send(
					`${mention} is already married to <@${m.accept}>`
				);
			} else if (m.ask == author.id) {
				return channel.send(`You're aleady married to <@${m.accept}>`);
			} else if (m.accept == author.id) {
				return channel.send(`You're aleady married to <@${m.ask}>`);
			}
		}
		let reactionMessage = await channel.send(
			`${mention}, will you marry ${author}?`
		);
		const check = '✅';
		const cross = '❌';
		await reactionMessage.react(check);
		await reactionMessage.react(cross);
		const filter = (reaction, user) =>
			(!user.bot &&
				user.id == mention.id &&
				reaction.emoji.name === check) ||
			(!user.bot &&
				user.id == mention.id &&
				reaction.emoji.name === cross);

		const collector = reactionMessage.createReactionCollector({
			filter,
			time: 15000,
			max: 1,
		});
		collector.on('collect', (reaction, user) => {
			if (reaction.emoji.name == check) {
				channel.send(`${mention} is now married to ${author}`);
				let newMarry = {
					ask: author.id,
					accept: mention.id,
				};
				marry = [...marry, newMarry];
				fs.writeFileSync(
					'./database/marry.json',
					JSON.stringify(marry, null, 2)
				);
			} else if (reaction.emoji.name == cross) {
				channel.send(
					`Sorry but ${mention} doesn't want to marry you ${author}`
				);
			}
		});
	}
});

client.on('guildMemberAdd', (member) => {
	const messageSend = `Welcome <@${member.id}> to our server`;
	let welcomeChannel = member.guild.channels.cache.find(
		(channel) => channel.name === 'Welcome' || channel.name === 'welcome'
	);
	if (welcomeChannel) {
		welcomeChannel.send(messageSend);
	}
	if (!welcomeChannel) {
		let welcome;
		member.guild.channels.cache.forEach((channel) => {
			if (channel.type === 'text' && !welcome) welcome = channel;
		});

		welcome.send(messageSend);
	} else {
		console.log("Couldn't find channel'");
	}
});

client.on('guildCreate', (guild) => {
	let channeltoSend;
	guild.channels.cache.forEach((channel) => {
		if (
			channel.type === 'text' &&
			!channeltoSend &&
			channel.permissionsFor(guild.me).has('SEND_MESSAGES')
		)
			channeltoSend = channel;
	});
	if (!channeltoSend) return;

	let channelEmbed = new Discord.MessageEmbed()
		.setColor(0xff1100)
		.setAuthor(`Hi! Thank you for inviting me to ${guild.name}!`)
		.setDescription('Prefix is ";"');

	channeltoSend.send(channelEmbed).catch((e) => {
		if (e) {
			return;
		}
	});

	//    guild.roles.create({
	//         data: {
	//           name: 'Muted',
	//           color: 'BLACK',
	//           reason: 'Need mute role',
	//           permissions: ["SEND_MESSAGES"]
	//         },

	//       })
	guild.channels.create('Peety-bot-channels', {
		type: 'category',
		position: 0,
	});
	guild.channels.create('Peety-bot-updates', 'text').then((addChannel) => {
		const categoryId = guild.channels.cache.find(
			(c) => c.name === 'Peety-bot-channels'
		);
		addChannel.setParent(categoryId);
	});
});
//client.user.setActivity('Test', { type: 'CUSTOM_STATUS', name: 'Peety' });
client.login(
	'ODExMjA1OTk3NTQwMDE2MTQ4.GvvUY4.Hn2gafi2vl_aYHIlolU69-m6UxZYuJedK0Bayw'
);
