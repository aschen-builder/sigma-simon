# Sigma Simon

Sigma Simon is a **node-served Radio Bot** created using **discord.js** and **ffmpeg** packages. Current use is isolated to **Sigma Draconis Games**, and assists in player interaction on our Space Engineers cluster.

## Installation

The only prerequisites to using the radio bot is a system installation of node.js, an internet connection, and a fresh Discord bot setup via the [Discord Developer Portal](https://discord.com/developers/applications).

Sigma Simon can be installed by running `npm install` on the unzipped root directory. This will install all necessary dependencies and get the bot ready for use.

Once you've installed all dependencies, you can add your Discord Bot's token to `config.json` found in the root directory.

You are all set! Sigma Simon is now ready for use.

## Initialization

To initialize the Radio Bot, navigate to the root directory from terminal and run `node main.js`. You will see an initialization response confirming the bot is now active.

## Commands

The Radio Bot currently uses static-mapping of commands, but will be updated to dynamic-mapping in the near future. The bot currently supports 6 commands:

`radio-start` => fetches audio files and begins playing the Radio Bot in the command author's current voice channel

`radio-stop` => stops the Radio Bot and disconnects it from the current voice channel

`radio-skip` => skips the current track and proceeds to the next in queue without transition

`radio-pause` => saves state of current track and pauses the stream

`radio-resume` => resumes stream from last state

`radio-kill` => leaves the current voice channel and kills the node.js process

