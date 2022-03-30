
import * as Colyseus from "colyseus.js"
import Chessboard from "chessboardjsx"
import React from 'react'
import styled from "styled-components";
import moveSfx from '../assets/move.mp3'
import invalidSfx from '../assets/invalid.mp3'
import {useLocation} from 'react-router-dom'
// Change the following line to your port number + ip that you want the users to call to (i.e. http://localhost:2567 or a custom domain)
const client = new Colyseus.Client('wss://chaos-chess.herokuapp.com');


let position = "8/8/8/8/8/8/8/8 w - - 0 1"

const move = new Audio(moveSfx)
const invalid = new Audio(invalidSfx)
export default class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = { 
            position: position,
            room: null, playerColor : null, 
            win:null, history:[], 
            historyHeader:"", 
            boardEnabled:true,
            squareStyles : {}
        };
    }
    
   joinRoom = () =>{
       const ROOM_TYPE = document.getElementsByClassName("page-heading")[0].innerHTML.toLowerCase();
       console.log(ROOM_TYPE)
    client.joinOrCreate(ROOM_TYPE).then(room => {
        console.log(room.sessionId, "joined", room.name)
        room.onMessage("start", (message) => {
            console.log("Game is starting!")
            });
        room.onMessage("setPosition", (message) => {
            console.log("setPosition", message)
            this.setState({position: message})
            move.play();
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
            this.setState({win: message.text});
            if(message.boardEnabled){
                console.log("Board enabled: " + message.boardEnabled)
                this.setState({ boardEnabled: message.boardEnabled });
            }
        });
        room.onMessage("invalid", message => {
            invalid.play();
        });
        room.onMessage("styleSquare", message => {
            this.setState({
                squareStyles:  message 
            })
        })
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
            <HomeButton></HomeButton>
            
        <GameStateContainer>
       <RoomTypeHeading></RoomTypeHeading>
        <h2>{this.state.win}</h2>
        </GameStateContainer>
        <HistoryContainer className="history-sidebar">
            <h3>{this.state.historyHeader}</h3>
            <h4>{this.state.comment}</h4>
            <div className="history-container">
                {this.state.history.map(move => { return <div className="history-item">{move.join().replaceAll(",", " | ")} </div> })}
        </div>
        </HistoryContainer>
        <div style={boardsContainer}>
                <Button className="join-button" onClick={() => {
                    this.joinRoom()
                }}>Start a Game</Button>
                <Chessboard position={this.state.position} orientation={this.state.playerColor === "w" ? "white" : "black"} onDrop={this.onDrop} draggable={this.state.boardEnabled} squareStyles={this.state.squareStyles} />
        </div>
    </body>
    </>
)
}
}

function RoomTypeHeading(props) {
    const location = useLocation();
    if (!location.state?.type){
        window.location.href = "/"
    }
    const capitalText = location.state.type.charAt(0).toUpperCase() + location.state.type.slice(1);
    return (
        <>
            <h1 className="page-heading">{capitalText}</h1>
        </>
    )
}
function HomeButton(props) {
    return (
        <>
            <Button className="home-button" onClick={() => {
                window.location.href = "/"
            }
            }>Home</Button>
        </>
    )
}
const boardsContainer = {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    flexWrap: "wrap",
    width: "100vw",
    marginTop: 30,
    marginBottom: 50,
    position: "absolute",
    bottom: "0%",
    right: "10%",
}
const Button = styled.button`
  background-color: #747578;
  color: white;
  font-size: 20px;
  padding: 10px 60px;
  border-radius: 10px;
  margin: 10px 0px;
  z-index: 2;
  cursor: pointer;
  border: solid 4px #7FC29B;
`;
const HistoryContainer = styled.div`
    width: 20%;
    height: -webkit-fill-available;
    position: absolute;
    top: 0%;
    right: 0%;
    color: #7FC29B;
    background-color: #030027;
    text-align:center;
    @media (max-width: 767px) {
          display: none;
    }
        `;
const GameStateContainer = styled.div`
    background-color: #C7DFC5;
    top: 0%;
    position: absolute;
    padding-right: 20%;
    text-align: center;
    width: -webkit-fill-available;
    z-index: -1;
`

