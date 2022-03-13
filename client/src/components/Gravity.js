
import * as Colyseus from "colyseus.js"
import Chessboard from "chessboardjsx";
import React from 'react'
const client = new Colyseus.Client('ws://localhost:2567')
const ROOM_GRAVITY = 'gravity'
let position = "8/8/8/8/8/8/8/8 w - - 0 1"
export default class Gravity extends React.Component {
    constructor(props){
        super(props);
        this.state = { position: position };
    }
   joinGravity = () =>{
    client.joinOrCreate(ROOM_GRAVITY).then(room => {
        console.log(room.sessionId, "joined", room.name)
        room.onMessage("start", (message) => {
            console.log("Game is starting!")
        });
        room.onMessage("setPosition", (message) => {
            console.log("setPosition", message)
            this.setState({position: message})
            });
        document.getElementsByClassName('join-button')[0].remove();
    }).catch(e => {
        console.log("JOIN ERROR", e)
    })

}
    componentDidMount() {
        console.log("Component did mount")
    }
 render(){
return(
    <>
       <h1>Gravity</h1>
        <button className="join-button" onClick={() => {
            this.joinGravity()
        }}>Join Gravity Chess</button>
        <Chessboard
            width={400}
            position={this.state.position}
        />
    </>
)
}
}
