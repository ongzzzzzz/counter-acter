const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send("I'm not dead! :D"));

app.listen(port, () => console.log(`listening at http://localhost:${port}`));

const fs = require('fs');
const Discord = require('discord.js');
const prefix = "./counter";

const client = new Discord.Client();

const targetChannels = ['count-to-a-million', 'bot-playground'];

const Database = require("@replit/database");
const db = new Database();

//var schedule = require('node-schedule');

function isNumeric(myString) { return /\d/.test(myString); }
function randomElem (array) {	return array[Math.floor(Math.random() * array.length)] }
async function set_db(name, value) {
	await db.set(name, value.toString())
    .then(() => 
	    console.log(`saved ${value} to "${name}"`)
    ); 
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


//var count;

client.once("ready", async () => {

	console.log(`Logged in as ${client.user.tag}`);
	client.user.setActivity("people count in #count-to-a-million", 
		{ type: "WATCHING" }
	);

    // init
    for (let channel_name of targetChannels) {
        let lastNum = await db.get(`count_${channel_name}`);
        if (!isNumeric(lastNum)) {
            console.log("Initializing database: " + channel_name);
            set_db(`count_${channel_name}`, '0'); 
        }
    }
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
    if (message.author.bot) return;
	try {
		// console.log(message.channel.id) // get channel id
		if(targetChannels.includes(message.channel.name)){
			if(!isNumeric(message.content)){
				message.delete();
				message.author.send(randomElem(nanError)).catch(e => console.error(e));
			} else {

                let lastAuthor = await db.get(`lastAuthor_${message.channel.name}`);
                // double count
				if (message.author.id === lastAuthor) {
					message.delete();
					message.author.send(randomElem(twiceError)).catch(e => console.error(e));
					return;
				}

				let sentNum = parseInt(message.content);

                // multiple lines
				if (/\r\n|\r|\n/.test(message.content)){					
					if(message.content.match(/\d/g).length > sentNum.toString().split("").length){
						message.delete();
						message.author.send(randomElem(newlineError)).catch(e => console.error(e));
						return;
					}
				}


				let lastSentNum = await db.get(`count_${message.channel.name}`);
				lastSentNum = await parseInt(lastSentNum);
                console.log("lastSentNum from database: " + lastSentNum);

				if (sentNum != (lastSentNum+1) ){

					message.delete();
					message.author.send(
						randomElem(wrongNumError)
							.formatUnicorn({number: lastSentNum+1})
					).catch(e => console.error(e));

				} else {

					set_db(`count_${message.channel.name}`, sentNum);
					set_db(`lastAuthor_${message.channel.name}`, message.author.id);
                    
				}
			}
		} 
	} catch (e) {
		console.error(e);
	}
});

client.on('messageUpdate', async (oldMessage, newMessage) => {
    let lastSentNum = await parseInt(oldMessage.content);
    let newSentNum = await parseInt(newMessage.content);

    // ignore past messages
    let latestCnt = await db.get(`count_${newMessage.channel.name}`);
    if (lastSentNum.toString() != latestCnt) return;
    
    if(newSentNum != lastSentNum){
        await newMessage.delete();
        newMessage.author.send(randomElem(handGataiError))
            .catch(e => console.error(e));

        // don't count edited message
        set_db(`count_${newMessage.channel.name}`, lastSentNum-1)
        // set to last visible author
		let lastMsg = await newMessage.channel.messages.fetch({ limit: 1 });
        lastMsg = await lastMsg.last();
        set_db(`lastAuthor_${newMessage.channel.name}`, lastMsg.author.id);
    }
});

client.on('messageDelete', async Message => {

    let sentNum = parseInt(Message.content);
    // ignore past messages
    let latestCnt = await db.get(`count_${Message.channel.name}`);
    if (sentNum.toString() != latestCnt) return;
    
    // don't count deleted message
    set_db(`count_${Message.channel.name}`, sentNum-1);
    // set to last visible author
	let lastMsg = await Message.channel.messages.fetch({ limit: 1 });
    lastMsg = await lastMsg.last();
    set_db(`lastAuthor_${Message.channel.name}`, lastMsg.author.id);
});

client.login(process.env.BOT_TOKEN);
