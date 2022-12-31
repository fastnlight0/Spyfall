# Spyfall

## Installation
All you need is Node.JS. Simply run
```bash
node app.js
```
to start the app. Npm is not required, and no additional packages need to be installed.
## Connecting
Connect to the website by entering the IP of the host followed by the port (`http://ip:port`). The default port is 80, and you don't need to specify the port if you keep it on 80.
## Playing
Each player will enter their name on their device to join. If a player refreshes their browser or closes the tab, they will be removed from the game, but their name will remain. You will need to kick the player in order to fix it (see [terminal commands](#terminal-commands)). Once everybody has joined, any player can press `Start` to start the game. Everybody will be promped for a location. Once all players have submitted their locations, a random location will picked and each player will be told the location (except for the spy)
## Voting
If a player thinks they know who the spy is, they can start a vote on that player. Select the `vote` button and select the player to start the vote. All players will be prompted with the player starting the vote and who the vote is for. They can vote `yes` or `no`. If the vote passes, the game will end, and the location and spy will be revealed. If the vote does not pass, the game will continue.
## Host device
If you have a screen that is visible to everybody, you can make it a host screen. Simply enter the IP of the host followed by `/join` (`http://ip:port/join`). It will show join instructions, and when the game starts, will update to show current status. The location and the spy will not be revealed, so there is no worry about cheating.
## Terminal commands
There are a few commands that can be run in the terminal. They are:
* `help` - Shows a list of commands
* `start` - Starts the game
* `kick <player name>` - Kicks a player from the game
* `lp` - Lists all players
* `gi` - Gets the current game info (status, location, spy, etc, not recommended to use during a game)
* `clear` - Clears the terminal
* `reset` - Resets the game (same thing as a vote passing)

## How to play
If you don't know how to play Spyfall, here is how you play. Each player enters a location. It is recommended that players know about the locations before entering them. Once all players have entered a location, the game will begin. The game will pick a random location and player to become the spy. All players will be told the location except for the spy. The players will begin to question each other, trying to figure out who the spy is. The spy, on the other hand, is trying to figure out the location. If a player thinks they know who the spy is, they can start a vote. If the vote passes, the game will end. If players correctly guessed the spy, they win. If they guessed incorrectly, the spy wins. If the vote does not pass, the game will continue. At any time, the spy can end the game and take a shot at guessing the location. If they guess correctly, they win. If they guess incorrectly, the players win.
## Other info
This project was meant to be a small project for me and my friends to play, but I decided to make it public. On the host screen, the join instructions will be incorrect, so feel free to correct them yourself (it shows my (local) ip, has Wi-Fi connection instructions, etc). It is also supposed to have QR codes for Wi-Fi joining and connecting to the website, but I will not include them in this GitHub for privacy purposes. Feel free to modify this project and make it work for you.
## License
Feel free to use, modify, and distribute this project however you would like with 0 consequences or restrictions. I would appreciate it if you gave me credit, but it is not required.
