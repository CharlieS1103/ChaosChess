import * as schema from "@colyseus/schema";
import { Chess } from "chess.js";
export class DefaultState extends schema.Schema {
    constructor() {
        super();
        this.chess = new Chess();
    }
}

schema.defineTypes(DefaultState, {
    mySynchronizedProperty: "string",
});
