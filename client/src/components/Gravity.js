
import * as Colyseus from "colyseus.js"
import Chessboard from "chessboardjsx"
import React from 'react'
import styled from "styled-components";
const client = new Colyseus.Client('ws://localhost:2567')
const ROOM_GRAVITY = 'gravity'
let position = "8/8/8/8/8/8/8/8 w - - 0 1"
let room = null;
let playerColor = null;
let win = null;
let history = [];
let comment = null;
export default class Gravity extends React.Component {
    constructor(props){
        super(props);
        this.state = { position: position, room: room, playerColor : playerColor, win:win, history:history,comment:comment };
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
        room.onMessage("updateHistory", (message) => {
            console.log("updateHistory", message)
            this.setState({history: message})
            });
        room.onMessage("playerColor", (message) => {
            console.log("playerColor", message)
            this.setState({playerColor: message})
            console.log(this.state.playerColor)
            });
        room.onMessage("gameOver", message => {
            this.setState({win: message});
        });

        
      
            this.setState({room: room})
        document.getElementsByClassName('join-button')[0].remove();
    }).catch(e => {
        console.log("JOIN ERROR", e)
    })

}

    componentDidMount() {
        console.log("Component did mount")
    }
    onDrop = ({ sourceSquare, targetSquare }) => {
        const color = this.state.playerColor
        this.state.room.send("move", { sourceSquare, targetSquare, color } )
    };
 render(){
return(
    <>
       <h1>Gravity</h1>
        <Button className="join-button" onClick={() => {
            this.joinGravity()
        }}>Join Gravity Chess</Button>
        <h2>{this.state.win}</h2>
        <div className="history-sidebar">
            <h3>History</h3>
            <h4>{this.state.comment}</h4>
            <div className="history-container">
                {this.state.history}
        </div>
        </div>
        <div style={boardsContainer}>
            <Chessboard position={this.state.position} orientation={this.state.playerColor==="w"? "white" : "black"} onDrop={this.onDrop}/>
        </div>
    </>
)
}
}


const boardsContainer = {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexWrap: "wrap",
    width: "100vw",
    marginTop: 30,
    marginBottom: 50
}
const Button = styled.button`
  background-color: black;
  color: white;
  font-size: 20px;
  padding: 10px 60px;
  border-radius: 5px;
  margin: 10px 0px;
  cursor: pointer;
`;
