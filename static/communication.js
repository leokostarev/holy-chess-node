let pubnub = new PubNub({
    publishKey:   "pub-c-78f8aeaf-c800-4522-a006-df4b63f56915",//fixme
    subscribeKey: "sub-c-fcf7a377-4aed-450e-a840-5a9aae9969d8",
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
