const http = require("http")
const fs = require("fs").promises
const readline = require("readline")

let players = []
let mode = 0
let locations = []
let location = ""
let spy = ""
let checks = 0
let mc = 0;
let reset = false;
let starter = ""
let vote = ""
let yes = 0
let no = 0
let startPerson = ""
http.createServer(function (req, res) {
    if (req.url === "/") {
        fs.readFile(__dirname + "/index.html")
            .then(contents => {
                res.writeHead(200, { "Content-Type": "text/html" })
                res.end(contents)
            })
    } else if (req.url == "/join") {
        fs.readFile(__dirname + "/join.html").then(contents => {
            res.writeHead(200, { "Content-Type": "text/html" })
            res.end(contents)
        })
    } else if (req.url == "/wifi.png") {
        fs.readFile(__dirname + "/wifi.png").then(contents => {
            res.writeHead(200, { "Content-Type": "image/png" })
            res.end(contents)
        })
    }
    else if (req.url == "/web.png") {
        fs.readFile(__dirname + "/web.png").then(contents => {
            res.writeHead(200, { "Content-Type": "image/png" })
            res.end(contents)
        })
    } else if (req.url.startsWith("/api")) {
        let url = req.url.substring(4)
        if (url.startsWith("/join")) {
            let name = url.substring(6)
            while (name.includes("%20")) {
                name = name.replace("%20", " ")
            }
            if (players.includes(name)) {
                res.writeHead(200, { "Content-Type": "text/plain" })
                res.end("Taken")
            } else if (mode != 0) {
                res.writeHead(200, { "Content-Type": "text/plain" })
                res.end(mode == 1 ? "Game" : "Started")
            } else if (name.includes("/") || name.includes("<br>") || name.includes(",")) {
                res.writeHead(200, { "Content-Type": "text/plain" })
                res.end("Invalid")
            } else {
                console.log("Player joined: " + name)
                process.stdout.write("> ")
                players.push(name)
                res.writeHead(200, { "Content-Type": "text/plain" })
                res.end("200 OK")
            }
        } else if (url.startsWith("/players")) {
            res.writeHead(200, { "Content-Type": "text/plain" })
            res.end(players.join(", "))
        } else if (url.startsWith("/stream")) {
            res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", "Connection": "keep-alive" })
            return setInterval(() => {
                if (reset) {
                    res.write("data: reset\n\n")
                } else {
                    if (mode == 0) {
                        res.write(`data: ${players.join("<br>")}\n\n`)
                    } else if (mode == 1) {
                        if (mc == 0) {
                            mc = 1
                            console.log("Game started by " + startPerson)
                            process.stdout.write("> ")
                            console.log("Game status: Location selection")
                            process.stdout.write("> ")
                        }
                        res.write(`data: start\n\n`)
                        if (players.length == locations.length) {
                            mode = 2
                        }
                    } else if (mode == 2) {
                        if (mc == 1) {
                            mc = 2
                            console.log("Game status: Starting")
                            process.stdout.write("> ")
                        }
                        setTimeout(() => {
                            if (location == "") {
                                let rand = Math.floor(Math.random() * locations.length)
                                location = locations[rand]
                                rand = Math.floor(Math.random() * players.length)
                                spy = players[rand]
                            }
                            res.write(`data: ${location},${spy},${players.join("/")}\n\n`)
                        }, 1000)
                    } else if (mode == 5) {
                        res.write(`data: vote/${starter}/${vote}\n\n`)
                    } else if (mode == 6) {
                        res.write(`data: return\n\n`)
                    }
                }
            }, 1000)
        } else if (url.startsWith("/leave")) {
            let name = url.substring(7)
            while (name.includes("%20")) {
                name = name.replace("%20", " ")
            }
            console.log("Player left: " + name)
            players = players.filter(p => p !== name)
            res.writeHead(200, { "Content-Type": "text/plain" })
            res.end("200 OK")
        } else if (url.startsWith("/start")) {
            startPerson = url.substring(7)
            while (startPerson.includes("%20")) {
                startPerson = startPerson.replace("%20", " ")
            }
            mode = 1
            res.writeHead(200, { "Content-Type": "text/plain" })
            res.end("200 OK")
        } else if (url.startsWith("/loc")) {
            let loc = url.substring(5)
            while (loc.includes("%20")) {
                loc = loc.replace("%20", " ")
            }
            locations.push(loc)
            res.writeHead(200, { "Content-Type": "text/plain" })
            res.end("200 OK")
        } else if (url.startsWith("/check")) {
            checks++
            if (checks == players.length) {
                mode = 3
                checks = 0
                if (mc == 2) {
                    mc = 3
                    console.log("Game status: Check complete")
                    process.stdout.write("> ")
                }
            }
            res.writeHead(200, { "Content-Type": "text/plain" })
            res.end("200 OK")
        } else if (url.startsWith("/vote")) {
            if (mode == 3) {
                starter = url.substring(6).split("/")[0]
                vote = url.substring(6).split("/")[1]
                while (starter.includes("%20")) {
                    starter = starter.replace("%20", " ")
                }
                while (vote.includes("%20")) {
                    vote = vote.replace("%20", " ")
                }
                mode = 5
                console.log(starter + " started a vote on " + vote)
                yes++
                process.stdout.write("> ")
            }
            res.writeHead(200, { "Content-Type": "text/plain" })
            res.end("200 OK")
        } else if (url.startsWith("/yes")) {
            yes++
            res.writeHead(200, { "Content-Type": "text/plain" })
            if (yes >= Math.ceil(players.length / 2) || no >= Math.ceil(players.length / 2) || yes + no == players.length) {
                console.log("Vote complete")
                process.stdout.write("> ")
                if (yes > no) {
                    mode = 4
                    console.log(vote + " was voted out")
                    process.stdout.write("> ")
                    mode = 0
                    locations = []
                    location = ""
                    players = []
                    spy = ""
                    checks = 0
                    mc = 0
                    console.log("Resetting game...")
                    reset = true
                    setTimeout(() => {
                        reset = false
                        console.log("Game reset");
                        process.stdout.write("> ")
                    }, 5000)
                } else {
                    console.log("Vote did not pass")
                    mode = 6
                    process.stdout.write("> ")
                }
                yes = 0
                no = 0
            } else {
                res.end("200 OK")
            }
        } else if (url.startsWith("/no")) {
            no++
            res.writeHead(200, { "Content-Type": "text/plain" })
            if (yes >= Math.ceil(players.length / 2) || no >= Math.ceil(players.length / 2) || yes + no == players.length) {
                console.log("Vote complete")
                process.stdout.write("> ")
                if (yes > no) {
                    mode = 4
                    console.log(vote + " was voted out")
                    process.stdout.write("> ")
                    mode = 0
                    locations = []
                    location = ""
                    players = []
                    spy = ""
                    checks = 0
                    mc = 0
                    console.log("Resetting game...")
                    reset = true
                    setTimeout(() => {
                        reset = false
                        console.log("Game reset");
                        process.stdout.write("> ")
                    }, 5000)
                } else {
                    console.log("Vote did not pass")
                    mode = 6
                    process.stdout.write("> ")
                }
                yes = 0
                no = 0
            } else {
                res.end("200 OK")
            }
        }
    }

}).listen(process.env.port || 80, function () {
    console.log(`zServer online!\nType: Spyfall\nPort: ${process.env.port || 80}\n`)
    process.stdout.write("> ")
})

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "> "
})
rl.on("line", function (line) {
    if (line.startsWith("start")) {
        mode = 1
    } else if (line.startsWith("reset")) {
        mode = 0
        locations = []
        location = ""
        players = []
        spy = ""
        checks = 0
        mc = 0
        console.log("Resetting game...")
        reset = true
        setTimeout(() => {
            reset = false
            console.log("Game reset");
        }, 5000)
    } else if (line.startsWith("kick")) {
        let name = line.substring(5)
        while (name.includes("%20")) {
            name = name.replace("%20", " ")
        }
        let prel = players.length
        players = players.filter(p => p !== name)
        if (prel != players.length) {
            console.log("Player kicked: " + name)
        } else {
            console.log("Error: Player not found")
        }
    } else if (line.startsWith("lp")) {
        console.log(players.join(", "))
    } else if (line.startsWith("gi")) {
        let status = ""
        switch (mode) {
            case 0:
                status = "Waiting for players"
                break
            case 1:
                status = "Location selection"
                break
            case 2:
                status = "Starting"
                break
            case 3:
                status = "Game in progress"
                break
            case 5:
                status = "Vote in progress"
                break
        }
        console.log("Game status: " + status)
        console.log("Players: " + players.join(", ") + " (" + players.length + ")")
        console.log("Locations: " + locations.join(", ") + " (" + locations.length + ")")
        console.log("Spy: " + spy)
        console.log("Location: " + location)
    } else if (line.startsWith("clear")) {
        console.clear()
    } else if (line.startsWith("help")) {
        console.log("start - Start the game\nreset - Reset the game\nkick <player> - Kick a player\nlp - List players\ngi - Show game info\nclear - Clear the console\nhelp - Show this message")
    } else if (line != "") {
        console.log("Error: Command not found")
    }
    process.stdout.write("> ")
})


rl.on("close", function () {
    process.exit(0)
})
