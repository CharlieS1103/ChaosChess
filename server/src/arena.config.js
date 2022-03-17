import Arena from "@colyseus/arena";
import { monitor } from "@colyseus/monitor";
import basicAuth from "express-basic-auth";
/**
 * Import your Room files
 */
import { Gravity } from "./rooms/Gravity.js";
import { Flipped } from "./rooms/Flipped.js";


const basicAuthMiddleware = basicAuth({
	// list of users and passwords
	users: {
		"admin": "admin",
	},
	// sends WWW-Authenticate header, which will prompt the user to fill
	// credentials in
	challenge: true
});

export default Arena.default({
	getId: () => "Your Colyseus App",

	initializeGameServer: (gameServer) => {
		/**
         * Define your room handlers:
         */
		gameServer.define("gravity", Gravity);
		gameServer.define("flipped", Flipped)
	},

	initializeExpress: (app) => {
		/**
         * Bind your custom express routes here:

        
        /**
         * Bind @colyseus/monitor
         * It is recommended to protect this route with a password.
         * Read more: https://docs.colyseus.io/tools/monitor/
         */
		app.use("/colyseus", basicAuthMiddleware, monitor());
	},

	beforeListen: () => {
		/**
         * Before before gameServer.listen() is called.
         */
	}

});
