import { Room } from "@colyseus/core";
import { GravityState } from "./schema/GravityState.js";
export class Gravity extends Room {

	onCreate () {
		let turn = "w";
		let fenArr= null;
		this.setState(new GravityState());
		this.maxClients = 2;
		this.onMessage("start", (client, message) => {
			console.log("start", message);
			this.broadcast("start", message);
		}
		);


		// On move handler
		this.onMessage("move", (client, message) => {
			
			console.log("move", message);
			console.log(turn);
			const move = this.state.chess.move({
				from: message.sourceSquare,
				to: message.targetSquare,
				promotion: "q"
			});
			// Check if the move is valid
			if (move === null) {
				console.log("Invalid move");
				return;
			}
			// Check if it is the users turn
			if(turn != message.color){
				console.log("Not your turn");
				return;
			}
			turn = turn === "w" ? "b" : "w";
			fenArr = this.state.chess.fen().split(" ")[0].split("/");
			console.log(fenArr);
			let gameBoardMap = fenArr.map(el => el.split("").map(c => !isNaN(c) ? "o".repeat(c) : c).join(""));
			// Make gameBoardMap a 2d array
			gameBoardMap = gameBoardMap.map(el => el.split(""));
		
			for (var i = 0; i < gameBoardMap.length; i++) {
				console.log(gameBoardMap[i].join(""));
			}
			this.broadcast("setPosition", this.state.chess.fen());
			this.broadcast("updateHistory", this.state.chess.history());
			if(this.state.chess.in_checkmate()){
				this.broadcast("gameOver", "Checkmate!" + " " + message.color === "b" ? "White Wins!" : "Black Wins!");
			}
			if (this.state.chess.in_draw()) {
				this.broadcast("gameOver", "Draw!");
			}
		});
	}

	onJoin (client) {

		console.log(client.sessionId, "joined!");
		if(this.clients.length === 2) {

			this.broadcast("setPosition", this.state.chess.fen());
			this.broadcast("start", "Game has started!");
			this.broadcast("playerColor", "b",{except: this.clients[0]});
		}
		if(this.clients.length === 1){
			this.broadcast("playerColor", "w");
		}
	}

	onLeave (client) {
		console.log(client.sessionId, "left!");
		this.disconnect();
	}

	onDispose() {
		console.log("room", this.roomId, "disposing...");
	}

}
