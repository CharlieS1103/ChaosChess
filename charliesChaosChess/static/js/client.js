import * as Colyseus from "colyseus.js";
function joinRoom() {
    document.getElementsByClassName("create-button")[0].onclick = function () { 
    var client = new Colyseus.Client('ws://localhost:2567');
    client.joinOrCreate("battle", {/* options */ }).then(room => {
        console.log("joined successfully", room);
    }).catch(e => {
        console.error("join error", e);
    });
    };
}