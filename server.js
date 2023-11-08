const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const Pusher = require("pusher");
const http = require("http");

const app = express();
const server = http.createServer(app);


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "templates"));

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "/static")));


const pusher = new Pusher({
    appId:   "1702906",
    key:     "96a6c5bc9ce712f90ddb",
    secret:  "e8bbb2802116a4bba605",
    cluster: "eu",
    useTLS:  true,
});

app.get("/", (req, res) => {
    res.render("index");
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

setInterval(() => {
    pusher.trigger("index-ch", "message", {
        message: "yo mama",
    });
}, 5000);

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
