import { Room } from "@colyseus/core";
import { DefaultState } from "./schema/DefaultState.js";
export class Evolution extends Room {

    onCreate() {
        /* Initialize variables*/
        let turn = "w";

        let history = [];
        
        // Set the state based on  the schema
        this.setState(new DefaultState());
        this.maxClients = 2;

        const piecesArr = ["p","n","b","r","q"];
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
            const piece = this.state.chess.get(message.sourceSquare)
            const pieceMoved = piece.type
            
            console.log("Piece moved: " + pieceMoved)
            const move = this.state.chess.move({
                from: message.sourceSquare,
                to: message.targetSquare,
                promotion: "q"
            });
            // Check if the move is valid
            if(pieceMoved == "q"){
                this.state.chess.put({type:"p", color: turn}, message.targetSquare);
            }else{
                const nextPiece = piecesArr[piecesArr.indexOf(pieceMoved) + 1];
                console.log(nextPiece)
                this.state.chess.put({ type: nextPiece, color: turn},message.targetSquare);
            }
            if (move === null) {
                console.log("Invalid move " + message.sourceSquare + " to " + message.targetSquare);
                this.broadcast("invalid", { except: this.clients[0] });
                return;
            }

            turn = turn === "w" ? "b" : "w";
            this.state.chess.load(this.state.chess.fen());
            this.broadcast("setPosition", this.state.chess.fen());
           
            const histToPush = piece.type != "p" ? piece.type + message.targetSquare : message.targetSquare;
            history.push(histToPush);
            // Group the history array by every two elements
            const accumHistory = history.reduce((acc, cur, i) => {
                if (i % 2 === 0) {
                    acc.push([cur]);
                } else {
                    acc[acc.length - 1].push(cur);
                }
                return acc;
            }, []);
            this.broadcast("updateHistory", { history: accumHistory, title: "History" });
            // Check if the game is over and update game state accordingly
            if (this.state.chess.in_checkmate()) {
                console.log("Checkmate");
                this.broadcast("gameState", { text: "Checkmate!" + " " + message.color === "b" ? "White Wins!" : "Black Wins!", boardEnabled: false });
            }
            if (this.state.chess.in_draw()) {
                console.log("Draw");
                this.broadcast("gameState", { text: "Draw!", boardEnabled: false });
            }
        });
    }


    onJoin(client) {

        console.log(client.sessionId, "joined!");
        if (this.clients.length === 2) {
            /* When the second user joins:
             Update the gamestate to playing
             Lock the room(to prevent more players from joining)
             Set the gameboard to the initial position
             Set their color(always black)
             */
            this.lock();
            const startPos = "start"
            this.broadcast("gameState", { text: "Playing!", boardEnabled: true });
            this.broadcast("setPosition", startPos);
            this.state.chess.load(startPos)
            this.broadcast("start", "Game has started!");
            this.broadcast("playerColor", "b", { except: this.clients[0] });
        }
        if (this.clients.length === 1) {
            /*No Handling for if the first user leaves necessary as the room will just be discarded */
            this.broadcast("gameState", { text: "Waiting for Opponent", boardEnabled: false });
            this.broadcast("playerColor", "w");
        }
    }

    onLeave(client) {
        console.log(client.sessionId, "left!");
        this.broadcast("gameState", { text: "Opponent left, You win!", boardEnabled: false });
        this.disconnect();
    }

    onDispose() {
        console.log("room", this.roomId, "disposing...");
    }

}
