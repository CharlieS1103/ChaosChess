import { Room } from "@colyseus/core";
import { GravityState } from "./schema/GravityState.js";
import {Chess} from 'chess.js'
export class Gravity extends Room {

  onCreate () {
    this.setState(new GravityState());
    this.maxClients = 2;
    this.onMessage("start", (client, message) => {
      console.log("start", message);
      this.broadcast("start", message);
    }
    );
  }

  onJoin (client, options) {
    console.log(client.sessionId, "joined!");
    if(this.clients.length === 2) {
      const chess = new Chess();
      this.broadcast("setPosition", chess.fen())
      this.broadcast("start", "Game has started!");
    }
  }

  onLeave (client, consented) {
    console.log(client.sessionId, "left!");
    this.disconnect();
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
