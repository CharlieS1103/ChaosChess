import * as schema from "@colyseus/schema";
import { Chess } from "chess.js";
export class FlippedState extends schema.Schema {
    constructor() {
        super();
        this.chess = new Chess();
    }
}

schema.defineTypes(FlippedState, {
    mySynchronizedProperty: "string",
});
