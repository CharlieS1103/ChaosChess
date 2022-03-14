
import * as Colyseus from "colyseus.js"
import Chessboard from "chessboardjsx"
import React from 'react'
import styled from "styled-components";
const client = new Colyseus.Client('ws://10.0.0.162:2567')
const ROOM_GRAVITY = 'gravity'
let position = "8/8/8/8/8/8/8/8 w - - 0 1"
export default class Gravity extends React.Component {
    constructor(props){
        super(props);
        this.state = { position: position, room: null, playerColor : null, win:null, history:[], historyHeader:"" };
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
            this.setState({history: message.history})
            this.setState({historyHeader: message.title})
            });
        room.onMessage("playerColor", (message) => {
            console.log("playerColor", message)
            this.setState({playerColor: message})
            console.log(this.state.playerColor)
            });
        room.onMessage("gameState", message => {
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
        document.body.style.backgroundColor = "#151E3F";
        document.body.style.color = "#7FC29B";
    }
    onDrop = ({ sourceSquare, targetSquare }) => {
        const color = this.state.playerColor
        this.state.room.send("move", { sourceSquare, targetSquare, color } )
    };
 render(){
return(
    <>
    <body>
            <h1>Gravity</h1>
        <Button className="join-button" onClick={() => {
            this.joinGravity()
        }}>Start a Game</Button>
        <h2>{this.state.win}</h2>
        <HistoryContainer className="history-sidebar">
            <h3>{this.state.historyHeader}</h3>
            <h4>{this.state.comment}</h4>
            <div className="history-container">
                {this.state.history.map(move => { return <div className="history-item">{move.join()} </div> })}
        </div>
        </HistoryContainer>
        <div style={boardsContainer}>
            <Chessboard position={this.state.position} orientation={this.state.playerColor==="w"? "white" : "black"} onDrop={this.onDrop}/>
        </div>
    </body>
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
  background-color: #747578;
  color: white;
  font-size: 20px;
  padding: 10px 60px;
  border-radius: 5px;
  margin: 10px 0px;
  cursor: pointer;
  border: solid 2px #C7DFC5
`;
const HistoryContainer = styled.div`
    width: 20%;
    height: -webkit-fill-available;
    position: absolute;
    top: 0%;
    right: 0%;
    color: #7FC29B;
    background-color: #030027;
    @media (max-width: 767px) {
          display: none;
        }
        `;