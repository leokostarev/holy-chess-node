function go() {
    fetch("https://holy-chess-node.vercel.app/chat");
    setTimeout(go, 2000);
}

go();