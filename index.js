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

const Database = require("@replit/database");
const db = new Database();

var count = null;

function isNumeric(myString) {
	return /\d/.test(myString);
}

function randomElem (array) {
	return array[Math.floor(Math.random() * array.length)]
}

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

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
		client.user.setActivity("people count in #count-to-a-million", 
		{ type: "WATCHING" });
});

// let channel = client.channels.fetch("781051991363026965");
/* 
1. if message not number then del message
2. get last message
3. last != this message, del this message
*/

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



client.on('message', async message => {
	try {
		if(message.channel.name === 'count-to-a-million'){
			let messages = await message.channel.messages.fetch({ limit: 2 });
			let lastMsg = messages.last();

			if(!isNumeric(message.content)){
				message.delete();
				message.author.send(randomElem(nanError));
			} else {
				if (message.author.id === lastMsg.author.id) {
					message.delete();
					message.author.send(randomElem(twiceError));
					return;
				}

				let sentNum = parseInt(message.content);
				let lastSentNum = parseInt(lastMsg.content);

				if (sentNum != lastSentNum+1) {
					message.delete();
					message.author.send(randomElem(wrongNumError)
						.formatUnicorn({number: lastSentNum+1})
					);
				}
			}
		} 
	} catch (e) {
		console.error(e);
	}
});

client.login(process.env.BOT_TOKEN);