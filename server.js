const express = require("express");
const path = require("path");
const socketio = require("socket.io");
const bodyParser = require("body-parser");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT ?? 80;


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "templates"));

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "/static")));


io.on("connection", (socket) => {
    socket.on("new_user", (data) => {
        socket.join(data.room);
        io.to(data.room).emit("message", {message: "SB joined the room"});
    });

    socket.on("message", (msg) => {
        io.to(msg.room).emit("message", msg);
    });
});

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/menu", (req, res) => {
    res.render("menu");
});

app.post("/menu", (req, res) => {
    console.log(req.body);
    if (req.body.do_create) {
        for (room of rooms) {
            if (room.name === req.body.name) {
                res.render("menu");
                return;
            }
            //new room todo
        }
    } else {
        for (room of rooms) {
            if (room.name === req.body.room && room.password === req.body.password) {
                //join
            } else {
                res.render("menu");
                return;
            }
        }
    }
    res.redirect("/game");
});

app.get("/game", (req, res) => {
    res.render("game");
});

let rooms = []; //[{name, password, Game}]

server.listen(
    PORT,
    "0.0.0.0",
    () => console.log(`listening on ${PORT}...`),
);
