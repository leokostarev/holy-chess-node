//========================================================================
//                                 IMPORTS
//========================================================================
const Favicon = require("serve-favicon");
const Cors = require("cors");
const Express = require("express");
const BodyParser = require("body-parser");
const Path = require("path");
const PubNub = require("pubnub");
const Http = require("http");

//========================================================================
//                                 CONFIG
//========================================================================
const app = Express();
const server = Http.createServer(app);

app.set("view engine", "ejs");
app.set("views", Path.join(__dirname, "templates"));

app.use(Cors());
app.use(Express.json());
app.use(BodyParser.urlencoded({extended: false}));
app.use(Express.static(Path.join(__dirname, "/static")));
app.use(Favicon(Path.join(__dirname, "/static/favicon.ico")));


const pubnub = new PubNub({
    publishKey:   "pub-c-78f8aeaf-c800-4522-a006-df4b63f56915",
    subscribeKey: "sub-c-fcf7a377-4aed-450e-a840-5a9aae9969d8",
    userId:       "server",
});

pubnub.subscribe({channels: ["to_server"]});

// add listener
pubnub.addListener({
    status:  (statusEvent) => {
        if (statusEvent.category === "PNConnectedCategory") {
            console.log("Connected");
        }
    },
    message: (message) => {
        publishMessage("Hi!:" + message.message);
    },
});

function publishMessage(message) {
    pubnub.publish({
        channel: "from_server",
        message: message,
    });
}

setInterval(() => {
    publishMessage("Hi mom!");
}, 3000);

//
// const readline = require("readline").createInterface({
//     input:  process.stdin,
//     output: process.stdout,
// });
//
// readline.setPrompt("");
// readline.prompt();
// // publish after hitting return
// readline.on("line", (message) => {
//     publishMessage(message).then(r => {
//     });
// });


//========================================================================
//                                 ROUTES
//========================================================================
app.get("/", (req, res) => {
    res.render("index");
});


app.get("/chat", (req, res) => {
    res.render("chat");
});


app.get("/menu", (req, res) => {
    res.render("menu");
});


app.post("/menu", (req, res) => {
    console.log(req.body);
    res.redirect("/game");
});


app.get("/game", (req, res) => {
    res.render("game");
});


//========================================================================
//                                 SETUP
//========================================================================


if (process.env.LOCAL) {
    console.log("LOCAL!", process.env.LOCAL);
    server.listen(
        process.env.PORT ?? 80,
        "0.0.0.0",
        () => console.log(`listening on ${(process.env.PORT ?? 80)}...`),
    );
} else {
    console.log("NONLOCAL!", process.env.LOCAL);
    server.listen(
        process.env.PORT ?? 3000,
        () => console.log(`listening on ${(process.env.PORT ?? 3000)}...`),
    );
    module.exports = app;
}
