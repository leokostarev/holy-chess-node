let pubnub = new PubNub({
    subscribeKey: PUBNUB_SUB_KEY,
    userId:       "online_session",
});

function send_to_server(channel, message) {
    let payload = {
        method:  "post",
        headers: {"Content-Type": "application/json"},
        body:    JSON.stringify({channel: channel, message: message}),
    };
    console.log(payload);
    fetch("/message", payload).then(x => console.log(x));
}
