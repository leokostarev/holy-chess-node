//========================================================================
//                                 IMPORTS
//========================================================================
const Favicon = require("serve-favicon");
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

app.use(Express.json());
app.use(BodyParser.urlencoded({extended: true}));
app.use("/static", Express.static(Path.join(__dirname, "static")));
app.use(Favicon(Path.join(__dirname, "static/favicon.ico")));


const pubnub = new PubNub({
    publishKey:   "pub-c-78f8aeaf-c800-4522-a006-df4b63f56915",
    subscribeKey: "sub-c-fcf7a377-4aed-450e-a840-5a9aae9969d8",
    userId:       "server",
});

// add listener
pubnub.addListener({
    status: (statusEvent) => {
        console.log(statusEvent);
    },
});

function publishMessage(channel, message) {
    pubnub.publish({
        channel: channel,
        message: message,
    });
}

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


// events
app.post("/message", (req, res) => {
    console.log(req.body);

    publishMessage("chat", req.body.message);

    res.status(200);
});

//========================================================================
//                                 SETUP
//========================================================================


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
    module.exports = app;
}
