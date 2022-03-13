import * as Colyseus from "colyseus.js"
const client = new Colyseus.Client('ws://localhost:2567')
const ROOM_GRAVITY = 'gravity'
const chaosChess = () => {
  const refreshGravity = () => {
    console.log('refreshing gravity...')
    client.getAvailableRooms(ROOM_GRAVITY).then(rooms => {
      rooms.forEach((room) => {
        const {
          roomId, clients, maxClients, metadata
        } = room
        console.log('rooms refreshed:', {
          roomId, clients, maxClients, metadata
        })
      })
    }).catch(e => {
      console.error(e)
    })
  }
  const joinGravity = () => {
    client.joinOrCreate(ROOM_GRAVITY).then(room => {
      console.log(room.sessionId, "joined", room.name)
    }).catch(e => {
      console.log("JOIN ERROR", e)
    })
  }
  return (
    <>
      <h1>Chaos Chess</h1>
      <button onClick={() => {
        refreshGravity()
      }}>refresh</button>
      <button onClick={() => {
        joinGravity()
      }}>Join Gravity Chess</button>
    </>
  )
}

export default chaosChess;
