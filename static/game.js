const socket = io.connect("http://192.168.1.70");

socket.emit("new_user", {"room": room});

$("#sender").on("click", () => {
        socket.emit("message", {
            "message": $("#inp").val(),
            "room": room,
        });
        $("#inp").val("");
    },
);

socket.on("message", msg => {
    console.log(msg);
    $("#messages").append($("<li>").text(msg.message));
});
