import Arena from "@colyseus/arena";
import { monitor } from "@colyseus/monitor";
import basicAuth from "express-basic-auth";
import express from "express";
/**
 * Import your Room files
 */
import { MyRoom } from "./rooms/MyRoom.js";
import path from 'path'

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
        gameServer.define('my_room', MyRoom);
    },

    initializeExpress: (app) => {
        /**
         * Bind your custom express routes here:
         */
        const __dirname = path.resolve()
            app.get("/", (req, res) => {
                res.sendFile(path.join(__dirname,'static/html/index.html'));
            });  
            app.use(express.static(__dirname + '/static'));
      
       

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
