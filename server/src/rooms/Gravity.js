import { Room } from "@colyseus/core";
import { Chess } from "chess.js";
import { GravityState } from "./schema/GravityState.js";
export class Gravity extends Room {

	onCreate () {
		/* Initialize variables*/
		let turn = "w";
		let fenArr= null;
		let history= [];
		
		// Set the state based on  the schema
		this.setState(new GravityState());
		this.maxClients = 2;


		this.onMessage("start", (client, message) => {
			console.log("start", message);
			this.broadcast("start", message);
		}
		);


		/* On Move message Handler */
		this.onMessage("move", (client, message) => {
			// Check if it is the users turn
			if (turn != message.color) {
				console.log("Not your turn");
				return;
			}
			let piece = this.state.chess.get(message.sourceSquare)
			let inCheck = false;
			if (this.state.chess.in_check()) {
				inCheck = true;
			}
			const move = this.state.chess.move({
				from: message.sourceSquare,
				to: message.targetSquare,
				promotion: "q"
			});
			// Check if the move is valid
			if (move === null) {
				console.log("Invalid move " + message.sourceSquare + " to " + message.targetSquare);
				
				return;
			}
			
	
		
			turn = turn === "w" ? "b" : "w";
			fenArr = this.state.chess.fen().split(" ")[0].split("/");
			let gameBoardMap = fenArr.map(el => el.split("").map(c => !isNaN(c) ? "o".repeat(c) : c).join(""));
			// Make gameBoardMap a 2d array
			gameBoardMap = gameBoardMap.map(el => el.split(""));
			let gravityChanged = false;
			do {
				gravityChanged = false;
				for (var i = 1; i < gameBoardMap.length; i++) {
					var boardRow = gameBoardMap[i];
					var previousRow = gameBoardMap[i - 1];
					var prevRowWhite = gameBoardMap[i+ 1];  
					for (var j = 0; j < boardRow.length; j++) {
						if (previousRow[j] === "o" && boardRow[j] !== "o" && boardRow[j] == boardRow[j].toLowerCase() 
						&& boardRow[j].toUpperCase() !== "P") {
							gameBoardMap[i - 1][j] = boardRow[j];
							boardRow[j] = "o";
							gravityChanged = true;							
						}
						if(prevRowWhite){
							if(prevRowWhite[j] === "o" && boardRow[j] !== "o" && boardRow[j] == boardRow[j].toUpperCase() 
							&& boardRow[j].toUpperCase() !== "P") {
								gameBoardMap[i + 1][j] = boardRow[j];
								boardRow[j] = "o";
								gravityChanged = true;							
							}
						}
					}
				}
			} while (gravityChanged== true);
			if (inCheck) {
				console.log("In check")
				var chess = new Chess(boardToFen(gameBoardMap, turn === "w" ? "b" : "w"));
				console.log(chess.fen());
				if (chess.in_check()) {
					console.log("Invalid move, you are in check");
					this.state.chess.undo();
					turn = turn === "w" ? "b" : "w";
					return;
				}
			}
			/* Loop through every row in gameboardMap and print it out
			for(var i = 0; i < gameBoardMap.length; i++) {
				console.log(gameBoardMap[i].join(""));
			}
			*/
			function boardToFen(board, color=null){
				let fen = "";
				for(var i = 0; i < board.length; i++) {
					let row = board[i];
					let rowFen = "";
					var empty = 0;
					for(var j = 0; j < row.length; j++) {
						
						if (row[j] == "o"){
							empty = empty+1;
							if(j == row.length-1){
								rowFen = rowFen + empty;
							}

						}else{
							if(empty > 0){
								rowFen += empty;
								empty = 0;
							}
							rowFen += row[j];
						} 
						
					}
					fen += rowFen + "/";
				}
				return fen.slice(0, -1) + " " + (color != null ? color : turn)+" KQkq - 0 1";

			}
			
			this.state.chess.load(boardToFen(gameBoardMap));
			this.broadcast("setPosition", this.state.chess.fen());
			const histToPush = piece.type != "p" ? piece.type + message.targetSquare : message.targetSquare;
			history.push(histToPush);
			// Group the history array by every two elements
			history = history.reduce((acc, cur, i) => {
				if (i % 2 === 0) {
					acc.push([cur]);
				} else {
					acc[acc.length - 1].push(cur);
				}
				return acc;
			}, []);

			this.broadcast("updateHistory", {history:history, title:"History"});
			// Check if the game is over and update game state accordingly
			if(this.state.chess.in_checkmate()){
				console.log("Checkmate");
				this.broadcast("gameState", {text:"Checkmate!" + " " + message.color === "b" ? "White Wins!" : "Black Wins!", boardEnabled:false});
			}
			if (this.state.chess.in_draw()) {
				console.log("Draw");
				this.broadcast("gameState", {text:"Draw!", boardEnabled:false});
			}
		});
	}

	
	onJoin (client) {

		console.log(client.sessionId, "joined!");
		if(this.clients.length === 2) {
			/* When the second user joins:
			 Update the gamestate to playing
			 Lock the room(to prevent more players from joining)
			 Set the gameboard to the initial position
			 Set their color(always black)
			 */
			this.lock();
			this.broadcast("gameState", {text:"Playing!", boardEnabled:true});
			this.broadcast("setPosition", this.state.chess.fen());
			this.broadcast("start", "Game has started!");
			this.broadcast("playerColor", "b",{except: this.clients[0]});
		}
		if(this.clients.length === 1){
			/*No Handling for if the first user leaves necessary as the room will just be discarded */
			this.broadcast("gameState", {text:"Waiting for Opponent", boardEnabled:false});
			this.broadcast("playerColor", "w");
		}
	}

	onLeave (client) {
		console.log(client.sessionId, "left!");
		this.broadcast("gameState", {text:"Opponent left, You win!", boardEnabled:false});
		this.disconnect();
	}

	onDispose() {
		console.log("room", this.roomId, "disposing...");
	}

}
