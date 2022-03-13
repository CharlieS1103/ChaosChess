
const chaosChess = () => {

  const joinGravity = () => {
  
      window.location.replace("/gravity")
  }
  return (
    <>
      <h1>Chaos Chess</h1>
      <button onClick={() => {
        joinGravity()
      }}>Join Gravity Chess</button>
    </>
   
  )
}

export default chaosChess;
