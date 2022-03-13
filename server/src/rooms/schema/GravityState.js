import * as schema from "@colyseus/schema";

export class GravityState extends schema.Schema {
  constructor() {
    super();
    this.mySynchronizedProperty = "Hello world";
  }
}

schema.defineTypes(GravityState, {
  mySynchronizedProperty: "string",
});
