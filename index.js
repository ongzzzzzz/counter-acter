const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send("I'm not dead! :D"));

app.listen(port, () => console.log(`listening at http://localhost:${port}`));

const fs = require('fs');
const Discord = require('discord.js');
const prefix = "./counter";


const client = new Discord.Client();
client.commands = new Discord.Collection();

const targetChannels = ['count-to-a-million', 'bot-playground'];
const targetChannelIds = ['780608907012866098', '782925243991457813'];
let targetChannelObjects = [];


const Database = require("@replit/database");
const db = new Database();


var schedule = require('node-schedule');


function isNumeric(myString) { return /\d/.test(myString); }
function randomElem (array) {	return array[Math.floor(Math.random() * array.length)] }
String.prototype.formatUnicorn = String.prototype.formatUnicorn ||
function () {
    "use strict";
    var str = this.toString();
    if (arguments.length) {
        var t = typeof arguments[0];
        var key;
        var args = ("string" === t || "number" === t) ?
            Array.prototype.slice.call(arguments)
            : arguments[0];

        for (key in args) {
            str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
        }
    }
    return str;
};
//"Hello, {name}, are you feeling {adjective}?".formatUnicorn({name:"Gabriel", adjective: "OK"});


const nanError = [
	"heyyy you should send a message starting with a number :P",
	"THAT'S NOT COUNTING THAT'S SENDING RANDOM WORDS",
	"my baby cousin also know that what u sent is not a number la..."
];

const twiceError = [
	"yoooooo you can't double count yourself",
	"KID WHY U SO KAMCHIONG CHILL PLS",
	"my primary school friends also know how to wait for their turn la...",
];

const wrongNumError = [
	"sup boiiii btw u should send {number}",
	"SEND WHAT LA U SHOULD SEND {number}",
	"my kindergarten teacher ask me to tell u to send {number}",
];

const handGataiError = [
	"OI U HAND GATAI EDIT U THINK IDK AH"
];

const newlineError = [
	"OI U KEGAO KIA WHAT U SEND HAR"
]


var count;

client.once("ready", async () => {

	console.log(`Logged in as ${client.user.tag}`);
	client.user.setActivity("people count in #count-to-a-million", 
		{ type: "WATCHING" }
	);

	// yes this is ugly but ehhhh it works
	let countToAMillionChannel = await client.channels.fetch("780608907012866098");
	let botPlaygroundChannnel = await client.channels.fetch("781051991363026965");
	targetChannelObjects.push(countToAMillionChannel);
	targetChannelObjects.push(botPlaygroundChannnel);

  // check for latest msgs every 2 secs
	var job = schedule.scheduleJob('*/2 * * * * *', async () => {

		targetChannelObjects.forEach(async channel => {
			let messages = await channel.messages.fetch({ limit: 1 });
			let lastMsg = messages.first();
			let latestNum = parseInt(lastMsg.content);

			db.get(`count_${channel.name}`).then(async value => {

				let lastAuthor = await db.get(`lastAuthor_${channel.name}`);

				if(lastMsg.author.id == lastAuthor){
					if(latestNum != value){
						console.log(`got ppl hand gatai edit in ${channel.name}`);
						await lastMsg.author.send(randomElem(handGataiError))
							.catch(e => console.error(e));
						await db.set(`count_${channel.name}`, value-1);
						lastMsg.delete();							
					}
				}

			});

			return
		})

	});

});


/* 
1. if message not number then del message
2. get last message
3. last != this message, del this message

prevent message edit: 
get msg every second, check if last message is correct

store and get from db
so each channel different streams of counting
*/





client.on('message', async message => {
	try {
		// console.log(message.channel.id) // get channel id
		if(targetChannels.includes(message.channel.name)){
			let messages = await message.channel.messages.fetch({ limit: 2 });
			let lastMsg = messages.last();

			if(!isNumeric(message.content)){
				message.delete();
				message.author.send(randomElem(nanError)).catch(e => console.error(e));
			} else {

				if (message.author.id === lastMsg.author.id) {
					message.delete();
					message.author.send(randomElem(twiceError)).catch(e => console.error(e));
					return;
				}

				let sentNum = parseInt(message.content);

				if (/\r\n|\r|\n/.test(message.content)){					
					if(message.content.match(/\d/g).length > sentNum.toString().split("").length){
						// console.log("OI REAL GOT KID")
						message.delete();
						message.author.send(randomElem(newlineError)).catch(e => console.error(e));
						return;
					}
				}

				// let lastSentNum = parseInt(lastMsg.content);
				// before /\ 			after \/
				let lastSentNum = await db.get(`count_${message.channel.name}`);
				lastSentNum = await parseInt(lastSentNum);

				if (sentNum != (lastSentNum+1) ){

					message.delete();
					message.author.send(
						randomElem(wrongNumError)
							.formatUnicorn({number: lastSentNum+1})
					).catch(e => console.error(e));

				} else {

					db.set(`count_${message.channel.name}`, sentNum.toString()).then(() => 
						console.log(`saved ${sentNum} to "count_${message.channel.name}"`)
					);
					db.set(`lastAuthor_${message.channel.name}`, message.author.id).then(() => 
						console.log(`saved ${message.author.id} to "lastAuthor_${message.channel.name}"`)
					);
					
				}
			}
		} 
	} catch (e) {
		console.error(e);
	}
});


client.login(process.env.BOT_TOKEN);