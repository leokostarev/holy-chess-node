//========================================================================
//                                 IMPORTS
//========================================================================
const Favicon = require("serve-favicon");
const Cors = require("cors");
const Express = require("express");
const BodyParser = require("body-parser");
// const Pusher = require("pusher-js");
const Path = require("path");
const Http = require("http");
const FileLog = require("log-to-file");

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

setInterval(() => {
    },
    3000);


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
