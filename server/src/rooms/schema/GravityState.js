import * as schema from "@colyseus/schema";
import { Chess } from "chess.js";
export class GravityState extends schema.Schema {
	constructor() {
		super();
		this.chess = new Chess();
	}
}

schema.defineTypes(GravityState, {
	mySynchronizedProperty: "string",
});
