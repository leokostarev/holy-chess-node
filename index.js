//#region IMPORTS
const Favicon = require("serve-favicon");
const Express = require("express");
const Logging = require("./scripts/logging");
const {raise} = require("./scripts/utils");
const BodyParser = require("body-parser");
const Path = require("path");
const Dotenv = require("dotenv");
const PubNub = require("pubnub");
const Http = require("http");
const DBCon = require("./scripts/DBCon");
//#endregion


//#region CONFIG

//dotenv
Dotenv.config();

// express
const app = Express();
const server = Http.createServer(app);

app.set("view engine", "ejs");
app.set("views", Path.join(__dirname, "templates"));

app.use(Express.json());
app.use(BodyParser.urlencoded({extended: true}));
app.use("/static", Express.static(Path.join(__dirname, "static")));
app.use(Favicon(Path.join(__dirname, "static/favicon.ico")));

//pubnub
const pubnub = new PubNub({
    publishKey:   process.env.PUBNUB_PUB_KEY || raise("PUBNUB_PUB_KEY NOT SPECIFIED"),
    subscribeKey: process.env.PUBNUB_SUB_KEY || raise("PUBNUB_SUB_KEY NOT SPECIFIED"),
    userId:       "server",
});

pubnub.addListener({
    status: (statusEvent) => {
        console.log(statusEvent);
    },
});

const publishMessage = (channel, message) =>
    pubnub.publish({channel: channel, message: message});

//#endregion


//#region ROUTES

app.get("/", (req, res) => {
    res.render("index");
});


app.get("/chat", (req, res) => {
    res.render("chat", {PUBNUB_SUB_KEY: process.env.PUBNUB_SUB_KEY});
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


// events
app.post("/message", (req, res) => {
    console.log(req.body);

    publishMessage("chat", req.body.message);

    res.status(200);
});

//#endregion


//#region SETUP

Logging.log("express", "info", "starting up!");

if (process.env.LOCAL) {
    console.log("LOCAL!", process.env.LOCAL);
    server.listen(
        process.env.PORT ?? 80,
        () => console.log(`listening on ${(process.env.PORT ?? 80)}...`),
    );
} else {
    console.log("NONLOCAL!", process.env.LOCAL);
    server.listen(
        process.env.PORT ?? 3000,
        () => console.log(`listening on ${(process.env.PORT ?? 3000)}...`),
    );
    console.log("EXPORTING");
    module.exports = exports = app;
}

//#endregion
