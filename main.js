const Discord = require('discord.js');
const fs = require('fs');

const client = new Discord.Client();

const {
    prefix,
    token,
    users,
    stations,  // TODO
    pattern // TODO
} = require('./config.json');

const audiodir= {
    title: 'Sigma Simon Episodes',
    description: 'Shared directory storing all of the Sigma Simon content',
    path: './audio'
};

const queue = new Map();

client.once('ready', () => {
    console.log('Sigma Simon is ready!');
});

client.once('disconnect', () => {
    console.log('Sigma Simon is disconnected!');
});

client.on('message', async message => {
    if (!message.content.startsWith(prefix) || !users.includes(message.member.id)) return;

    const guildQueue = queue.get(message.guild.id);

    if (message.content.startsWith(`${prefix}start`)) {
        play(message, guildQueue);
        return message.channel.send("Sigma Simon is now **LIVE** via the **Hydrogen Line**!");

    } else if (message.content.startsWith(`${prefix}skip`)) {
        skip(message, guildQueue);
        return message.channel.send("Must be something wrong with that there audio, skipping to the next!");

    } else if (message.content.startsWith(`${prefix}stop`)) {
        stop(message.member.voice.channel);
        return message.channel.send("Sigma Simon is being put into cryostasis...");

    } else if (message.content.startsWith(`${prefix}pause`)) {
        togglePause(message, guildQueue);
        return message.channel.send('Sigma Simon Radio is now paused...');

    } else if (message.content.startsWith(`${prefix}resume`)) {
        togglePause(message, guildQueue);
        return message.channel.send('Sigma Simon Radio is now resumed...');

    } else if (message.content.startsWith(`${prefix}poopchute`)) {
        message.channel.send('SHOW ME YOUR BUTTHOLE!', {files: ["C:/projects/sigma-simon-dev/img/okay maybe you don't want to go in here/seriously you should probably turn around/okay I warned you/poopchute.png"]});

    } else if (message.content.startsWith(`${prefix}kill`)) {
        message.channel.send('This feels like more than just stasis...');
        kill(message.member.voice.channel);

    } else {
        message.channel.send("Well... that probably didn't work out the way you wanted to lol");
    }
});

async function play(message, guildQueue) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
        return message.channel.send("You need to be in a voice channel to summon Simon.");
    }

    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send("Simon has not been given a voice, update his permissions!");
    }
    
    if (!guildQueue) {
        const queueConstruct = {
            //tc: message.channel,
            //vc: message.member.voice.channel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };

        queue.set(message.guild.id, queueConstruct);

        queueConstruct.songs = fetchSongs(audiodir.path);
        console.dir(queueConstruct.songs);

        try {
            var connection = await voiceChannel.join();
            queueConstruct.connection = connection;

            //queueConstruct.connection.play(`audio/${queueConstruct.songs[0]}`);
            execute(message.guild, queueConstruct.volume);
        } catch (err) {
            console.log(err);
            queue.delete(message.guild.id);

            return message.channel.send(err);
        }
    } else {
        guildQueue.songs = fetchSongs(audiodir.path);
        console.dir(guildQueue.songs);

        try {
            var connection = await voiceChannel.join();
            guildQueue.connection = connection;

            //queueConstruct.connection.play(`audio/${queueConstruct.songs[0]}`);
            execute(message.guild, guildQueue.volume);
        } catch (err) {
            console.log(err);
            queue.delete(message.guild.id);

            return message.channel.send(err);
        }
    }
}

function skip(message, guildQueue) {
    if (!message.member.voice.channel) {
        return message.channel.send("You need to be in a voice channel to summon Simon.");
    }

    if (!guildQueue) {
        return message.channel.send("The queue is empty, you cannot skip idiot...");
    }

    guildQueue.connection.dispatcher.end();
}

function execute(guild, vol) {
    const curQueue = queue.get(guild.id);

    const dispatcher = curQueue.connection;
    dispatcher
        .play(`audio/${curQueue.songs.shift()}`)
        .on('finish', () => {
            execute(guild);
        })
        .on('error', () => console.error(error));
}

function fetchSongs(path) {
    var trackCount = 0;
    var trackMap = new Map();

    pattern.forEach(function(e) {
        let dump = fs.readdirSync(e.path);
        trackMap.set(e.type, shuffleArr(dump));
        trackCount += dump.length;
    });

    //console.log(trackCount);
    //console.log(trackMap.get('song'));
    //console.log(trackMap.get('episode'));

    var tracks = [], i = 0;

    while (i < trackCount) {
        pattern.forEach(function(e) {
            if (fs.readdirSync(e.path).length != e.frequency) {
                for(j = 0; j < fs.readdirSync(e.path).length; j++) {
                    tracks.push(`${e.type}/${trackMap.get(e.type).shift()}`);
                }
            } else {
                for(j = 0; j < e.frequency; j++) {
                    tracks.push(`${e.type}/${trackMap.get(e.type).shift()}`);
                }
            }
            i += e.frequency;
        });

    }
    
    //console.log(tracks);
    //return shuffleArr(tracks);
    return tracks;
}

function stop(voicechannel) {
    voicechannel.leave();
    return;
}

function togglePause(message, guildQueue) {
    if (message.content.split('-')[1] === 'pause' ) {
        guildQueue.connection.dispatcher.pause(true);
    } else if (message.content.split('-')[1] === 'resume' ) {
        guildQueue.connection.dispatcher.resume();
    }
}

function kill(vc) {
    vc.leave();
    setTimeout((function() {
        return process.exit(22);
    }), 5000);
}

function shuffleArr(arr) {
    for(let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i);
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    return arr;
}

client.login(token);