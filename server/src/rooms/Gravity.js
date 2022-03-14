import { Room } from "@colyseus/core";
import { GravityState } from "./schema/GravityState.js";
export class Gravity extends Room {

	onCreate () {
		let turn = "w";
		let fenArr= null;
		let history= null;
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
			if (turn != message.color) {
				console.log("Not your turn");
				return;
			}
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
		
			turn = turn === "w" ? "b" : "w";
			fenArr = this.state.chess.fen().split(" ")[0].split("/");
			let gameBoardMap = fenArr.map(el => el.split("").map(c => !isNaN(c) ? "o".repeat(c) : c).join(""));
			// Make gameBoardMap a 2d array
			// eslint-disable-next-line no-unused-vars
			gameBoardMap = gameBoardMap.map(el => el.split(""));
			for (var i = 0; i < gameBoardMap.length; i++) {
				console.log(gameBoardMap[i].join(""));
			}
      
			this.broadcast("setPosition", this.state.chess.fen());
			history = this.state.chess.history();
			// Group the history array by every two elements
			history = history.reduce((acc, cur, i) => {
				if (i % 2 === 0) {
					acc.push([cur]);
				} else {
					acc[acc.length - 1].push(cur);
				}
				return acc;
			}, []);
			console.log(history);
			this.broadcast("updateHistory", {history:history, title:"History"});
			if(this.state.chess.in_checkmate()){
				console.log("Checkmate");
				this.broadcast("gameState", "Checkmate!" + " " + message.color === "w" ? "White Wins!" : "Black Wins!");
			}
			if (this.state.chess.in_draw()) {
				console.log("Draw");
				this.broadcast("gameState", "Draw!");
			}
		});
	}

	onJoin (client) {

		console.log(client.sessionId, "joined!");
		if(this.clients.length === 2) {
			this.broadcast("gameState", "Playing!");
			this.broadcast("setPosition", this.state.chess.fen());
			this.broadcast("start", "Game has started!");
			this.broadcast("playerColor", "b",{except: this.clients[0]});
		}
		if(this.clients.length === 1){
			this.broadcast("gameState", "Waiting for Opponent");
			this.broadcast("playerColor", "w");
		}
	}

	onLeave (client) {
		console.log(client.sessionId, "left!");
		this.broadcast("gameState", "Opponent left, You win!");
		this.disconnect();
	}

	onDispose() {
		console.log("room", this.roomId, "disposing...");
	}

}
