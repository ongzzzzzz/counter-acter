const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send("I'm not dead! :D"));

app.listen(port, () => console.log(`listening at http://localhost:${port}`));

// https://gabrieltanner.org/blog/dicord-music-bot
// https://gabrieltanner.org/blog/dicord-music-bot
// https://gabrieltanner.org/blog/dicord-music-bot
// search: build a voice bot discord

const Discord = require("discord.js");
const client = new Discord.Client();
const Database = require("@replit/database");
const db = new Database();
const glob = require('glob');


const prefix = "./";
const commands = ['oi', 'sauce', 'help', 'sum', 'count', 'rap', 'ttb', 'link', 'hjonk']



let hjonk = 0;
let toxicUsernameList = {};
const toxicMsgs = [

];


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function isValidURL(string) {
  var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
  return (res !== null)
};


client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
		client.user.setActivity("24 hour lofi", 
		{ type: "STREAMING" });
});

client.on("message", async function(message) { 
  // if (message.author.bot) return;
  	if(toxicUsernameList.hasOwnProperty(message.author.username)){
			let toxictts = toxicUsernameList[message.author.username];
			let toxicMsg = toxicMsgs[Math.floor(Math.random() * toxicMsgs.length)];
			message.reply(toxicMsg, {tts: toxictts});
	}
	if (!message.content.startsWith(prefix) && !message.content.toUpperCase().includes("HJONK HJONK")) return;

	const commandBody = message.content.slice(prefix.length);
	const args = commandBody.split(' ');
	const command = args.shift().toLowerCase();

	if(message.content.toUpperCase().includes("HJONK HJONK") && hjonk){
		message.channel.send("U HJONK WHAT LA U GOOSE");
	}

	try{
		if (command === "oi") {
			//./oi <tts>
			const timeTaken = Date.now() - message.createdTimestamp;
			message.channel.send(
				`u oi me for what... i reply in ${timeTaken}ms.`, 
				{tts: args[args.length-1]==='tts'} 
			);
		}
		else if (command === "sauce") {
			//./sauce
			message.channel.send(
				'a friend told me the sauce was <https://github.com/Fogeinator/botte>...',
				{tts: args[args.length-1]==='tts'}
			);
		}
		else if (command === "help") {
			let commandString = '"' + commands.join('", "') + '"';
			message.channel.send(`hey kid my commands got ${commandString}`, 
			{tts: args[args.length-1]==='tts', 
			files: [ "https://raw.githubusercontent.com/Fogeinator/botte/main/images/help.png" ]
			})
		}
		else if (command === "sum") {
			//./sum [loads of numbers]
			const numArgs = args.map(x => parseFloat(x));
			const sum = numArgs.reduce((counter, x) => counter += x);
			isNaN(sum) ?
			message.channel.send(`you can only sum numbers dumbass`)
			:
			message.channel.send(
				`The sum of all the arguments you provided is ${sum}!`
			);
		}
		else if (command === "count") {
			//./count *num* <tts>
			let x = 0;
			while(x <= args[0]){
				message.channel.send(
					x.toString(), 
					{tts: args[args.length-1]==='tts'}
				);
				await sleep(1000);
				x += 1;
			}
		}
		else if (command === "rap") {
			//./rap <69>
			let rap = "tsstsststsstssts ";
			let ttsString = ""; 
			if(!args[0]){
				ttsString = rap
			} else {
				let x = 1;
				while(x <= args[0]){
					ttsString += rap;
					x += 1;
				}
			}
			message.channel.send(ttsString, {tts: true});
		}
		else if (command === "ttb"){
			//./ttb f4m
			
			if(!args[0]){
				message.channel.send("tell me wat class u want uwu")
			} else {

				let classs = args[0].toLowerCase();
				glob("images/ttbs/*.png", function (err, files) {
					if(files.includes(`images/ttbs/${classs}.png`)){
						message.channel.send(`${classs} timetable`, 
						{files: [  `https://raw.githubusercontent.com/Fogeinator/botte/main/images/ttbs/${classs}.png`  ]})
					} else {
						message.channel.send("send what cacat stuff i cant find eh", 
						{files: [ "https://i.giphy.com/media/8L0Pky6C83SzkzU55a/source.gif" ]})
					}
				})

			}
		}
		else if (command === "link"){
			if(args[0] === "set"){
				//./link set f4m bio eaubaougboaegoaeoigbea
				let classss = args[1].toUpperCase();
				let period = args[2].toUpperCase();
				let zoomLink = args[3];

				!classss ? message.channel.send("ur class cacat")
				: !period ? message.channel.send("ur period cacat")
					: !isValidURL(zoomLink) ? message.channel.send("ur link cacat")
						: db.set(`${classss}_${period}`, `${zoomLink}`)
							.then(() => message.channel.send(
								`I saved <${zoomLink}> to ${classss}_${period}`
							))
			} 
			else if (args[0] === "delete"){
				//./link delete f4m bio
				let classss = args[1].toUpperCase();
				let period = args[2].toUpperCase();

				(classss && period) ?
				db.get(`${classss}_${period}`).then(value => {
					value ?
					db.delete(`${classss}_${period}`)
					.then(() => message.channel.send(
						`I just deleted ${classss}'s ${period} link... I hope you know what you're doing kiddo!`
					))
					:
					message.channel.send('u no set link u delete waht link la kid', {tts: true});
				})
				
				:
				message.channel.send(`one of your params are missing, check again...`);

			}
			else if (args[0] === "list"){
				if(!args[1]){
					message.channel.send("pls give class uwu (./link list <class>)")
				} else {

					db.list().then(keys => {
						let classes = keys.filter(key => key.includes(args[1].toUpperCase()))
						classes.forEach(classs => {
							db.get(classs).then(link => {
								message.channel.send(`${classs} => <${link}>`);
							});
						})
					});
					//play withi cron-schedule
				}
				
			}
			else {
				//./link f4m bio
				
				if(args[0] && args[1]){

					let classss = args[0].toUpperCase();
					let period = args[1].toUpperCase();

					db.get(`${classss}_${period}`).then(value => {
					value ? 
						message.channel.send(
							`${classss} ${period} class link: <${value}>`
						)
						: 
						message.channel.send(
							`i think u not yet run: ./link set ${args[0]} ${args[1]} <link>` 
						)
					})

				} else {
					message.channel.send("say what la... give me ./link <class> <period>")
				}				
			}
		}
		else if (command === "hjonk"){
			hjonk = !hjonk;
			let bool = hjonk ? "ON" : "OFF"
			message.channel.send(`HEY GOOSE HJONK MODE ${bool}`, {tts: args[args.length-1]==='tts'});
		}
		else if (command === "toxic"){
			// ./toxic @johnchua
			let taggedUser = message.guild.member(message.mentions.users.first());
			if(taggedUser){
				//if someone kegao tag botte
				// console.log(message.author.username);
				// console.log(`username: ${taggedUser.user.username}`)
				if(	taggedUser.user.username === 'botte' || 
					taggedUser.user.username === 'fogeinator' || 
					taggedUser.user.username === 'z'
				){
					//assign tts to that obj
					toxicUsernameList[message.author.username] = args[args.length-1]==='tts';
					message.channel.send(`U WANT TOXIC ME AND MY FRIEND AH?? I TOXIC U D`);
				} else {
					//if alr toxic'ed
					if(toxicUsernameList.hasOwnProperty(taggedUser.user.username)){
						//if want untoxic self
						if(message.author.username === taggedUser.user.username){
							toxicUsernameList[message.author.username] = true;
							message.channel.send(`U THINK U CAN UNTOXIC YOURSELF MEH??? I TOXIC U MORE WITH TTS LIAO LO`, {tts: toxicUsernameList[message.author.username]});
						} else {
						//toggle toxic
							delete toxicUsernameList[taggedUser.user.username]
							// console.log(taggedUser.user.username)
							// console.log(toxicUsernameList);
							message.channel.send(`TOXIC ${taggedUser.user.username.toUpperCase()}: OFF`);

						}

					} else {

						toxicUsernameList[taggedUser.user.username] = args[args.length-1]==='tts';
						// console.log(taggedUser.user.username);
						console.log(toxicUsernameList);
						args[args.length-1]==='tts' ?
						message.channel.send(`TOXIC ${taggedUser.user.username.toUpperCase()}: ON WITH TTS`)
						:
						message.channel.send(`TOXIC ${taggedUser.user.username.toUpperCase()}: ON`);

					}
				}
			} else {
				message.reply(`IF U NO TELL ME WHO TO TOXIC THEN I ALMOST WANT TOXIC U LIAO`);
			}

			if(args[0] === "list"){

			}
			
		}


	} catch (err) {
		console.error(err);
		message.channel.send("im sry u say what idk pun")
	}



});  

client.login(process.env.BOT_TOKEN);